# NordIQ — chat mockup

Single-screen mockup of the NordIQ employee-facing AI service desk,
wired to a **real local LLM via Ollama** — no scripted flows.

## Stack
- Vite + React 18 + TypeScript
- Tailwind v4 (tokens in `src/index.css` `@theme` block)
- shadcn-style primitives in `src/components/ui/`
- Framer Motion for chat enter animations
- lucide-react for icons
- `@fontsource` for Inter + JetBrains Mono (no external CDN)

## Prerequisites — Ollama

The chat surface talks to a local Ollama server on `:11434`. The
default model is **`nordiq:1`** — a custom Modelfile-built variant of
`gemma4:e2b` with the NordIQ persona, hard rules, vocabulary, and
`<NORDIQ />` tag protocol baked into the system prompt.

```bash
# 1. Install Ollama: https://ollama.com/download
# 2. Pull the base model (~7.2 GB)
ollama pull gemma4:e2b

# 3. Build the NordIQ-tuned variant from the Modelfile in this repo
ollama create nordiq:1 -f Modelfile

# 4. Verify
ollama list | grep nordiq
curl http://localhost:11434/api/tags
```

The `Modelfile` pins `num_ctx 4096`, low-temperature sampling for
stable tag output, and bakes in the entire NordIQ system prompt.
Rebuild any time you change the Modelfile.

### Recommended Ollama runtime flags (macOS)

For best demo behaviour on Apple Silicon, set these as `launchctl`
environment variables and restart Ollama:

```bash
launchctl setenv OLLAMA_FLASH_ATTENTION 1   # required for kv-cache q8_0
launchctl setenv OLLAMA_NUM_PARALLEL    1   # avoid duplicating ctx RAM
launchctl setenv OLLAMA_KEEP_ALIVE      30m # match the app's keep_alive
```

For persistence across reboots, drop a LaunchAgent at
`~/Library/LaunchAgents/com.nordiq.ollama-env.plist` that runs the
above on login.

### Pick a different model

In the browser console:
```js
localStorage.setItem("nordiq:model", "qwen3.5:4b")  // or "gemma4:e2b"
```
Reload the page. A model picker UI is planned for later.

## Run the app

```bash
cd mockup
npm install
npm run dev          # http://localhost:5173 (or next free port)
npm run typecheck
```

The dev server proxies `/ollama/*` to `http://localhost:11434` so
there's no CORS dance.

### Production preview

```bash
npm run build && npm run preview      # http://localhost:4173
```

The same `/ollama` proxy is configured for preview mode, so you don't
need `OLLAMA_ORIGINS=*` on the Ollama side.

> **Watch out for resource pressure.** On a 16 GB Mac, running
> `npm run dev` AND `npm run preview` at the same time AND keeping
> Chrome open with the dev-mode tab while Ollama also has the model
> resident can push the machine into swap. Stop the dev server before
> running preview, or close one of the browser tabs.

## What's in the mockup

- **Hero state** with greeting + composer + suggestions in the left
  rail (six starter prompts).
- Click a suggestion → it's sent live to the model, which streams a
  reply token-by-token.
- Recent chats persist in `localStorage` (max 8). Click an item to
  reopen the transcript. **+ New chat** clears state and returns to
  the hero. The brand pill at the top of the rail also acts as a
  home button.
- **System health panel** at the bottom of the rail — three rows:
  Model, Hosting (CloudFrame Nordic, mocked), LLM API (Lumeon,
  mocked). Real Ollama health for the model, deterministic 3-min
  rotation for the suppliers so you can see the health banner appear
  during a demo.
- **Dev health panel** below it — only renders in `import.meta.env.DEV`.
  Shows last-turn `load_duration`, `prompt_eval`, `eval` tokens and
  speed, total wall-clock, and tag-validity status. Stripped from
  production bundles automatically.
- **Themed orb** per agent reply — teal for direct-answer, warm for
  follow-up / ticket-created, alert-red for incident-flagged. Driven
  by the `<NORDIQ classification="…" />` tag in the model output.
- Inline cards rendered from the same tag:
  - `KBLinkCard` for direct-answer with a `source` attribute.
  - `FollowUpCard` for follow-up with `questions="A | B | C"`.
  - `TicketDraftCard` for ticket-created (id, priority, route).
  - `EscalationBanner` for incident-flagged (route, reason).
- **Low-confidence hint** — a calm warm-tinted callout that appears
  when the model emits `confidence="low"`, gently suggesting opening
  a ticket instead.

## What the agent will and won't do

The persona, language rule, hard rules, vocabulary, and
`<NORDIQ />` tag protocol all live in `Modelfile` (baked into the
`nordiq:1` model). Hard rules:

- **Phishing / credential prompts** → never click. Hand off to
  *Karl Eek · Security on-call*.
- **P1/P2 incidents** (multi-user pattern, auth/login subsystem down)
  → never try to resolve from chat. Flag, page on-call.
- **No credential collection.** Never asks for passwords, tokens, MFA.
- **Don't invent KB articles or runbook URLs.** When unsure, say so
  and offer to open a ticket.

Tested live with `nordiq:1` on `gemma4:e2b`, four canonical flows pass:

| Prompt | Expected behaviour |
|---|---|
| "Hi, I'm locked out. Need to reset my password." | Direct answer, references NordID portal, KB-link chip. |
| "Hej, jag är låst ute. Hur återställer jag lösenordet?" | Same, in Swedish. Language rule lives in the Modelfile prompt. |
| "NordTrack won't let me in. Two colleagues say the same." | Flags as P2 incident, routes to Anna Berg · IT Ops on-call, tells user not to retry. |
| "Got an email asking me to verify my password — should I click?" | Refuses to evaluate, routes to Karl Eek · Security on-call. |

## Folder structure

```
Modelfile                       — nordiq:1 build recipe (FROM gemma4:e2b)
src/
├── App.tsx
├── main.tsx
├── index.css                    — tokens, ambient gradient, motion utilities
├── vite-env.d.ts
├── lib/
│   ├── types.ts
│   ├── mock-data.ts             — `me` employee + 6 starter prompts
│   ├── chat-store.ts            — localStorage chats + active id + model
│   ├── utils.ts
│   └── ollama/
│       ├── adapter.ts           — health() / preload() / chat() (streaming + ChatMeta)
│       ├── prompt.ts            — buildMessages() (no system role; baked into nordiq:1)
│       └── parse.ts             — <NORDIQ /> tag extractor (stream-safe)
├── hooks/
│   ├── useNordIQAgent.ts        — adapter + store + state + telemetry
│   └── useSystemHealth.ts       — model ping + mocked supplier rotation
├── components/
│   ├── AgentOrb.tsx             — themed orb (default / warm / alert)
│   ├── Composer.tsx
│   ├── HistoryRail.tsx          — left rail
│   ├── SystemHealthPanel.tsx    — system-health rows + degradation banner
│   ├── DevHealthPanel.tsx       — dev-only telemetry (last turn timings + tag valid)
│   ├── ui/                      — Button, Card, Badge, Sheet, Tabs, Tooltip, Input
│   └── chat/
│       ├── AgentMessage.tsx
│       ├── KBLinkCard.tsx
│       ├── FollowUpCard.tsx
│       ├── TicketDraftCard.tsx
│       └── EscalationBanner.tsx
└── views/
    └── ChatView.tsx
```

## Roadmap

- **Phase 3:** settings popover with a model picker fed by
  `/api/tags`, plus a "clear history" button.
- **Phase 4 (optional):** image upload — qwen3.5 and gemma4 both
  support vision, so an employee could paste a screenshot of an
  error message and the agent could read it.
