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
default model is **`nordiq:2`** — a custom Modelfile-built variant of
`gemma4:e2b` with the NordIQ persona, hard rules, vocabulary,
`<NORDIQ />` tag protocol, **vision rule** (Phase 4 — multimodal
triage of attached screenshots) and **KB grounding rule** (only cite
sources from the in-process KB) baked into the system prompt.

```bash
# 1. Install Ollama: https://ollama.com/download
# 2. Pull the base model (~7.2 GB) — gemma4:e2b is multimodal
ollama pull gemma4:e2b

# 3. Build the Phase 4 NordIQ variant
ollama create nordiq:2 -f Modelfile.nordiq2

# 4. Verify
ollama list | grep nordiq
curl http://localhost:11434/api/tags
```

The `Modelfile.nordiq2` pins `num_ctx 4096`, low-temperature sampling
for stable tag output, and bakes in the full NordIQ system prompt
including VISION RULE and GROUNDING RULE. Rebuild any time you change
the Modelfile.

The previous `Modelfile` (which builds `nordiq:1`) is kept in the repo
for reference and rollback — it has the same persona but no vision or
KB grounding instructions.

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
cd app
npm install
npm run dev
# Vite picks 5173 by default, or the next free port if taken.
npm run typecheck
```

The dev server proxies `/ollama/*` to `http://localhost:11434` so
there's no CORS dance.

### Production preview

```bash
npm run build
npm run preview
```

Preview serves on `http://localhost:4173/` by default. The same
`/ollama` proxy is configured for preview mode, so you don't need
`OLLAMA_ORIGINS=*` on the Ollama side.

> **Don't paste the URL as a comment after the command.** Trailing
> `# http://...` ends up as an argv to `vite preview` and produces
> a noisy "project root contains #" warning. The server still runs;
> the warning is cosmetic.

> **Watch out for resource pressure.** On a 16 GB Mac, running
> `npm run dev` AND `npm run preview` at the same time AND keeping
> Chrome open with the dev-mode tab while Ollama also has the model
> resident can push the machine into swap. Stop the dev server before
> running preview, or close one of the browser tabs.

## Two surfaces

The mockup is structured around the CAB demo, not around an employee
self-serve product. Two views, one toggle.

### 1. Shadow Replay (default — CAB-facing)

Opens by default. A play button streams a representative queue of
yesterday's first-line tickets through NordIQ in shadow mode — the
agent isn't actually replying to anyone, it's deciding what it would
have done. The audience sees four kinds of verdict assigned live:
**deflect**, **escalate**, **incident**, **security**.

The demoable moment: three differently-worded tickets from
Engineering (one about "time reporting bouncing back to login", one
about "register hours auth loop after NordID", one about NordTrack
itself) get semantically clustered into a single P2 incident
candidate. Clustering runs as a second pass *after* every ticket has
been classified — chips and the Incident Correlation card therefore
appear at the end of the run, not during the stream. That correlation
is hard to fake with rules and is the moment the audience should
remember.

The right-hand evidence panel aggregates the run into the numbers
CAB cares about: deflection %, escalation count, incident clusters
formed, security routings — and a conditional go-live verdict at the
bottom.

Files: `src/views/ShadowReplayView.tsx`,
`src/hooks/useShadowReplay.ts`, `src/lib/replay/`,
`src/components/replay/`.

### 2. Employee chat (behind "Open employee view" in the header)

The original chat surface. Persona is Lina Nordin (HR). Onboarding-
shaped starter prompts in the left rail; free-text composer with
paperclip/drag-drop image attach. Demonstrates three things if you
need to show what an actual employee interaction looks like:

- **IT-intake packet.** Onboarding-style requests produce a structured
  `ServiceRequestPacket` — per-system requests, missing fields,
  required approvals, risks, ready-to-submit verdict. Click the
  inline card to open the full Sheet.
- **KB-grounded answers.** Each turn runs a keyword search across 8
  mock KB articles (`src/lib/kb/articles.ts`); top hits inject into
  the user turn. Modelfile GROUNDING RULE constrains
  `<NORDIQ source="…" />` to real titles — no hallucinated KB. Source
  chip opens a Sheet with the body, owner, and review date (SLO #6).
- **Vision.** Drop a screenshot, model reads it locally, triages
  accordingly.

Other surface details: themed agent orb per classification, inline
`KBLinkCard` / `FollowUpCard` / `TicketDraftCard` / `EscalationBanner`,
low-confidence hint, system-health rail panel (real model ping + mocked
supplier rotation), dev-only DevHealthPanel with last-turn telemetry.

## What the agent will and won't do

Persona, language rule, hard rules, vocabulary, tag protocol,
GROUNDING RULE, VISION RULE and INTAKE FLOW all live in
`Modelfile.nordiq2` (baked into `nordiq:2`). Hard rules:

- **Phishing / credential prompts** → never click. Hand off to
  *Karl Eek · Security on-call*.
- **P1/P2 incidents** (multi-user pattern, auth/login subsystem down)
  → never try to resolve from chat. Flag, page on-call.
- **No credential collection.** Never asks for passwords, tokens, MFA.
- **Don't invent KB articles or runbook URLs.** When unsure, say so
  and offer to open a ticket.

## Demo flow for CAB

1. Open the app — Shadow Replay greets you with "Awaiting shadow
   replay" and a Play button.
2. Click **Play replay**. Twelve tickets stream in over ~30–40 s,
   each classified live by `nordiq:2` (you can see "Live
   classification · nordiq:2 local" pulsing in the header).
3. After the last ticket lands, a second pass runs over everything
   the model flagged as `incident`. Three differently-worded reports
   (T-002, T-003, T-004) get clustered into one `nordtrack-auth` /
   `sso-auth-loop` incident — a chip appears under each ticket and
   the Incident Correlation card pops in on the right.
4. Verdict appears at the bottom of the evidence panel: "Conditional
   go. Pilot readiness."
5. Click **Open employee view** to show the actual employee surface
   (one Lina-onboarding run is the strongest single example).
6. Back via the small pill top-left.

## Folder structure

```
Modelfile                       — legacy nordiq:1 (kept for rollback)
Modelfile.nordiq2               — current nordiq:2 build recipe
src/
├── App.tsx                      — surface switcher (Shadow Replay ⇄ chat)
├── main.tsx
├── index.css                    — tokens, ambient gradient, motion utilities
├── vite-env.d.ts
├── lib/
│   ├── types.ts
│   ├── mock-data.ts             — Lina as `me`, three onboarding-shaped prompts
│   ├── chat-store.ts            — localStorage chats + active id + model
│   ├── utils.ts
│   ├── kb/
│   │   ├── articles.ts          — 8 mock KB articles with owner/reviewedAt
│   │   └── search.ts            — keyword scoring + title lookup
│   ├── intake/
│   │   └── types.ts             — ServiceRequestPacket schema + EXAMPLE_PACKET
│   ├── replay/
│   │   ├── types.ts             — REPLAY_QUEUE (12 tickets) + result types
│   │   └── parse.ts             — <NORDIQ_REPLAY/> + <NORDIQ_CLUSTER/> parsers
│   └── ollama/
│       ├── adapter.ts           — health() / preload() / chat() (streaming + ChatMeta)
│       ├── prompt.ts            — buildMessages() — prepends KB excerpts
│       └── parse.ts             — <NORDIQ /> tag + <NORDIQ_PACKET> extractor
├── hooks/
│   ├── useNordIQAgent.ts        — chat surface adapter + store + state
│   ├── useShadowReplay.ts       — replay orchestrator (classify + cluster pass)
│   └── useSystemHealth.ts       — model ping + mocked supplier rotation
├── components/
│   ├── AgentOrb.tsx
│   ├── Composer.tsx             — paperclip + drag-drop image upload
│   ├── HistoryRail.tsx
│   ├── SystemHealthPanel.tsx
│   ├── DevHealthPanel.tsx       — dev-only telemetry (stripped in prod)
│   ├── ui/                      — Button, Card, Badge, Sheet, Tabs, Tooltip, Input
│   ├── intake/
│   │   ├── ServiceRequestPacketCard.tsx  — inline summary
│   │   └── ServiceRequestPacketSheet.tsx — full read-out
│   ├── replay/
│   │   ├── TicketCard.tsx                — single replay row
│   │   └── EvidencePanel.tsx             — right-hand CAB evidence
│   └── chat/
│       ├── AgentMessage.tsx
│       ├── KBLinkCard.tsx
│       ├── KBArticleSheet.tsx
│       ├── FollowUpCard.tsx
│       ├── TicketDraftCard.tsx
│       └── EscalationBanner.tsx
└── views/
    ├── ChatView.tsx
    └── ShadowReplayView.tsx
```

## Roadmap (post-MVP)

- Editable tickets in Shadow Replay — change one inline, watch the
  classification update so a skeptic can probe.
- Persistence of the last replay run across reload (currently in-
  memory).
- Real KB ingestion path (Confluence/SharePoint adapter) instead of
  the in-process 8-article fixture.
- Settings popover with a model picker fed by `/api/tags`.
