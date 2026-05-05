# NordIQ — chat mockup

Single-screen mockup of the NordIQ employee-facing AI service desk.

## Stack
- Vite + React 18 + TypeScript
- Tailwind v4 (tokens in `src/index.css` `@theme` block)
- shadcn-style primitives in `src/components/ui/`
- Framer Motion for chat enter animations
- lucide-react for icons
- `@fontsource` for Inter + JetBrains Mono (no external CDN)

## Run

```bash
cd mockup
npm install
npm run dev          # http://localhost:5173 (or next free port)
npm run typecheck
```

## What's in the mockup

A single chat surface. Hero state on first load (greeting + composer + three quick-action chips). Click a chip — the corresponding case flow auto-plays.

Three scripted scenarios ([src/lib/mock-data.ts](src/lib/mock-data.ts) → `caseFlows`):

1. **Reset password** — direct answer with a quiet KB source chip.
2. **Onboard a consultant** — agent asks the missing fields, then drafts a slim ticket card.
3. **Several can't log in** — agent refuses to act, hands off to on-call with a calm escalation row.

Inline cues are deliberately quiet:
- A short coloured stripe + lowercase verb (`answered` / `asking back` / `ticket opened` / `handed off`) instead of a badge stack.
- KB sources as small chips, not big cards.
- Tickets as a single 1-row card.
- Escalation as a one-line row, no siren.

No dashboards, no SLO views, no model/policy admin, no risk register. Those live elsewhere — this is the surface a regular employee sees.

## Design direction
See `docs/spec.md` for the full design rationale (note: spec was written for an earlier multi-view version; some sections describe screens that no longer exist in this slim version).

## Folder structure

```
src/
├── App.tsx                 — single-view router
├── main.tsx
├── index.css               — Tailwind v4 + @theme tokens (dark, midnight base, sage accent)
├── lib/
│   ├── types.ts
│   ├── mock-data.ts        — three scripted case flows
│   └── utils.ts
├── components/
│   ├── AgentOrb.tsx        — pulsing presence visual
│   ├── Composer.tsx
│   ├── ui/                 — Button, Card, Badge, Sheet, Tabs, Tooltip, Input, Separator
│   └── chat/
│       ├── AgentMessage.tsx
│       ├── KBLinkCard.tsx
│       ├── FollowUpCard.tsx
│       ├── TicketDraftCard.tsx
│       └── EscalationBanner.tsx
└── views/
    └── ChatView.tsx        — hero state + chat state
```
