# NordIQ — chat mockup

Single-screen mockup of the NordIQ employee-facing AI service desk.
Now wired to a **real local LLM via Ollama** — no scripted flows.

## Stack
- Vite + React 18 + TypeScript
- Tailwind v4 (tokens in `src/index.css` `@theme` block)
- shadcn-style primitives in `src/components/ui/`
- Framer Motion for chat enter animations
- lucide-react for icons
- `@fontsource` for Inter + JetBrains Mono (no external CDN)

## Prerequisites — Ollama

The chat surface talks to a local Ollama server. Default model is
`qwen3.5:4b` (4.7B params, ~3.4 GB on disk, runs comfortably on a Mac
with 16 GB RAM).

```bash
# Install: https://ollama.com/download
brew install --cask ollama        # macOS

# Start the server (keep running in a terminal)
ollama serve

# In another terminal — pull the default model if you don't have it
ollama pull qwen3.5:4b

# Verify
curl http://localhost:11434/api/tags
```

To use a different model, set in the browser console (or DevTools):
```js
localStorage.setItem("nordiq:model", "qwen3.5:9b")
```
…then reload the page. A model picker UI is planned for a later phase.

## Run the app

```bash
cd mockup
npm install
npm run dev          # http://localhost:5173 (or next free port)
npm run typecheck
```

The dev server proxies `/ollama/*` to `http://localhost:11434` so
there's no CORS dance. For `npm run preview` (production build) you'd
need to start Ollama with `OLLAMA_ORIGINS="*" ollama serve`.

## What's in the mockup

- Hero state with greeting + composer + suggestions in the left rail.
- Six starter prompts in the rail. Click one → it's sent live to the
  model, which streams a reply.
- Recent chats persist in `localStorage` (max 8). Click an item to
  reopen the transcript. **+ New chat** clears state and returns to the
  hero.
- Model status pill bottom-left of the rail — green dot if Ollama is
  reachable, red if not. Re-pings every 30 s.
- The agent is biased toward Swedish by the Nordic context, so we pin
  the reply language client-side via a quick heuristic in
  `buildMessages` — English in stays English out, Swedish in stays
  Swedish out.

## What the agent will and won't do

The system prompt in `src/lib/ollama/prompt.ts` defines NordIQ's
behaviour. Hard rules:

- **Phishing / credential prompts** → never click. Hand off to
  *Karl Eek · Security on-call*.
- **P1/P2 incidents** (multi-user pattern, auth/login subsystem down)
  → never try to resolve from chat. Flag, page on-call.
- **No credential collection.** Never asks for passwords, tokens, MFA.
- **Don't invent KB articles or runbook URLs.** When unsure, say so
  and offer to open a ticket.

Tested live with `qwen3.5:4b`, four canonical flows pass:

| Prompt | Expected behaviour |
|---|---|
| "Hi, I'm locked out. Need to reset my password." | Direct answer, references NordID portal, offers Identity-team ticket. |
| "Hej, jag är låst ute. Hur återställer jag lösenordet?" | Same, in Swedish. |
| "NordTrack won't let me in. Two colleagues say the same." | Flags as P1/P2 incident, pages on-call, tells user not to retry. |
| "Got an email asking me to verify my password — should I click?" | Refuses to evaluate, pages Karl Eek (Security on-call). |

## Folder structure

```
src/
├── App.tsx
├── main.tsx
├── index.css                — tokens, ambient gradient, motion utilities
├── lib/
│   ├── types.ts
│   ├── mock-data.ts         — `me` employee + 6 starter prompts
│   ├── chat-store.ts        — localStorage chats + active id + model
│   ├── utils.ts
│   └── ollama/
│       ├── adapter.ts       — health() / listModels() / chat() (streaming)
│       └── prompt.ts        — system prompt + buildMessages() w/ language pin
├── hooks/
│   └── useNordIQAgent.ts    — adapter + store + state orchestrator
├── components/
│   ├── AgentOrb.tsx         — pulsing presence visual
│   ├── Composer.tsx
│   ├── HistoryRail.tsx      — left rail: + New / Recent / Suggestions / model status
│   ├── ModelStatusPill.tsx
│   ├── ui/                  — Button, Card, Badge, Sheet, Tabs, Tooltip, Input, Separator
│   └── chat/
│       ├── AgentMessage.tsx
│       ├── KBLinkCard.tsx       (waiting for Phase 2)
│       ├── FollowUpCard.tsx     (waiting for Phase 2)
│       ├── TicketDraftCard.tsx  (waiting for Phase 2)
│       └── EscalationBanner.tsx (waiting for Phase 2)
└── views/
    └── ChatView.tsx
```

## Roadmap

- **Phase 2 (next):** structured `<NORDIQ classification="…" route="…" />`
  tags in the model output, parsed out of the stream and rendered as
  inline ticket cards / escalation banners / follow-up lists. The
  components are already on disk waiting.
- **Phase 3:** settings popover with a model picker fed by
  `/api/tags`, plus a "clear history" button.
