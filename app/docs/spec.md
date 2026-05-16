# NordIQ AI Agent Mockup

> **Mockup specification — implementation-ready.** This document is the deliverable that pairs with the runnable React/TS mockup in this repo. Read this if you want to understand the *why* behind the screens; run `npm install && npm run dev` if you want to feel them.

---

## 1. Product Idea

NordIQ is an internal AI-assisted service desk for NordTech AB. The mockup shows NordIQ as a **governable IT service** — not a chatbot — that an employee can reach through Teams, email, or web, and that operations and CAB can audit, measure, and roll back.

The agent creates four kinds of value:

- **For employees:** correct answers in seconds for common IT issues, 24/7, without having to know the right route.
- **For first line:** removes the repeating ~40 % of FAQ tickets so people work on what actually requires judgment.
- **For second line and IT Ops:** every escalated case arrives structured (summary, category, priority, affected service, proposed next action, confidence). No more chasing the user.
- **For CIO / CAB / CFO:** a measurable, controllable surface — SLOs, gates, risk register, model status — so go-live can be approved as a *decision*, not a leap of faith.

How this differs from a normal chatbot:

- The agent **distinguishes its own modes** (`direct-answer`, `follow-up`, `ticket-created`, `escalated-l2`, `incident-flagged`, `human-handover`) and shows them inline.
- A **policy engine** sits between user message and model output. P1/P2 patterns, security keywords, and credential prompts short-circuit the model entirely.
- Every decision has an **audit trail entry**, KB-grounding sources, and a confidence score visible to ops.
- The product surfaces operate at three densities (chat → ops dashboards → CAB executive view), each with the right gravitas for the audience.

---

## 2. Assumptions

- The mockup runs locally only. No cloud calls, no network requests except for fonts (`@fontsource`, bundled).
- Local model is LLaMA-class on the inference node (`llama3:8b-instruct`); production may swap via `LocalModelAdapter`.
- All people, tickets, KB articles, costs, and timestamps in the mockup are fictional but realistic for a 450-person Nordic tech company.
- "Hypercare" is defined as 14 calendar days post go-live.
- CAB meeting date `2026-05-08` and hypercare end `2026-05-22` are placeholder anchors.
- The Lumeon API and CloudFrame Nordic are referenced as named dependencies but no real contracts or status feeds are simulated.

---

## 3. Design Goals

| Goal | How it shows up in the UI |
|---|---|
| **Visual feel — Nordic, professional, modern** | Restrained zinc palette, single muted accent (`oklch(52% 0.13 235)`), Inter + Inter Display + JetBrains Mono. No AI-purple, no neon, no pure `#000`. |
| **Accessibility** | WCAG-AA contrast on every surface; tabular numerals on every metric; focus rings on every interactive; status communicated by color *and* icon *and* label, never color alone. |
| **Trust** | Every agent message shows: classification badge, KB sources, confidence bar, timestamp. Audit trail one click away. |
| **Operational clarity** | One side-nav with three groups (Service / Operations / Governance). Status visible from every view (top-bar pill, side-rail footer model status). |
| **Decision maturity** | CAB readiness uses editorial typography — large `Inter Display`, asymmetric grid, hero verdict — to make "Conditional Go" land as a decision artifact, not a dashboard widget. |

---

## 4. Information Architecture

Single-page app with a left side rail grouping seven views into three concerns:

```
Service
  ├── Agent chat               (employee + ticket draft + escalation + audit)
  └── Incidents & queue        (active incidents + ticket queue)
Operations
  ├── SLO & operations         (8 metric cards + escalation queue + model + suppliers)
  ├── Knowledge base           (KB ownership/freshness table)
  └── Risk register            (inherent vs. residual table)
Governance
  ├── CAB readiness            (editorial hero + gates grid + sign-off chain)
  └── Model & policy           (adapter selection + policy rules + system prompt)
```

The default landing view is **CAB readiness**. This is intentional: most viewers in the mockup phase are decision-makers, and the editorial hero makes the recommendation immediately legible.

---

## 5. Main Screens

### 5.1 Agent chat ([src/views/ChatView.tsx](../src/views/ChatView.tsx))

- **Purpose:** Demonstrate the employee experience and the agent's decision-making, end-to-end.
- **Primary users:** Employees (live), CAB / IT Ops (during demo).
- **Key components:** `CaseContextCard`, `AgentMessage`, `TicketDraftCard`, `EscalationBanner`, `KBLinkCard`, `FollowUpCard`, `AuditTrailDrawer`, scenario rail.
- **Key interactions:** Pick one of three demo scenarios; click `Step` to advance the transcript; open `Audit trail` drawer; reset.
- **Data shown:** Channel, requester, agent classification, confidence bar, KB sources, ticket draft fields, incident severity, paged route.
- **Supports go-live readiness by:** Showing exactly *how* the agent decides — including when it refuses to act — so CAB can validate the guardrails.

### 5.2 Incidents & queue ([src/views/IncidentView.tsx](../src/views/IncidentView.tsx))

- **Purpose:** What's hot right now, plus the structured queue agent has produced.
- **Key components:** Incident hero cards (severity-colored), ticket queue table.
- **Supports go-live readiness by:** Proving the agent surfaces — not absorbs — incidents.

### 5.3 SLO & operations ([src/views/SLOView.tsx](../src/views/SLOView.tsx))

- **Purpose:** Live SLO health, escalation queue, model status, supplier status — everything Anna Berg checks at 09:00.
- **Key components:** `SLOMetricCard` × 8 with sparklines + tooltip explanations + delta vs. start-of-window, `EscalationQueue`, `ModelStatusPanel`, supplier rows.
- **Supports go-live readiness by:** Proves the SLO definitions are wired and observable, with an explicit "why CAB cares" tooltip on each.

### 5.4 Knowledge base ([src/views/KBView.tsx](../src/views/KBView.tsx))

- **Purpose:** Ownership and freshness of the corpus the agent grounds in.
- **Key components:** Coverage hero number, alert banner if `< 100 %`, dense table with status badges (`Current` / `Due soon` / `Stale` / `Missing owner`).
- **Supports go-live readiness by:** Anti-hallucination control. Visible to whoever owns each article.

### 5.5 Risk register ([src/views/RiskView.tsx](../src/views/RiskView.tsx))

- **Purpose:** Show inherent vs. residual risk side-by-side after controls.
- **Key components:** Summary pill row (counts by residual level), dense risk table.
- **Supports go-live readiness by:** Documents that controls are *named*, *owned*, and *visible in the UI*, not abstract policy text.

### 5.6 CAB readiness ([src/views/ReadinessView.tsx](../src/views/ReadinessView.tsx))

- **Purpose:** The decision artifact. One screen that answers "should we ship?".
- **Key components:** Editorial hero (verdict + recommendation in `Inter Display 56px`), gates progress card with hero numerals, conditions strip, gates grid (`ReadinessGate` × 8), sign-off chain, "what changes at go-live" panel.
- **Supports go-live readiness by:** This *is* the readiness surface. Approve / Open runbook / Export decision pack all live here.

### 5.7 Model & policy ([src/views/AdminView.tsx](../src/views/AdminView.tsx))

- **Purpose:** Governance seam. Shows the swap-in adapter, the policy rule engine, and the system prompt.
- **Key components:** Tabs (Model adapter / Policy rules / System prompt), `ModelStatusPanel`, adapter list with active state, policy rule list with effect-kind badges.
- **Supports go-live readiness by:** Proves the seam where local model can be swapped without UI rebuild — and shows CAB the actual policy text, not a marketing summary.

---

## 6. Agent Behavior

The agent's job is to **route**, not to be clever. It produces one of six decision types per turn:

| Decision | When |
|---|---|
| `direct-answer` | KB pattern matched, single user, high confidence, no security flags. |
| `follow-up` | Intent is clear but required structured fields are missing (typically onboarding intake). |
| `ticket-created` | After follow-up gathered enough fields, or for non-FAQ requests that can be safely queued. |
| `escalated-l2` | Ticket created and routed to a specific L2 team. |
| `incident-flagged` | Multi-user pattern, P1/P2 keywords, or pattern matches a known incident playbook. |
| `human-handover` | Security-related language, credentials, or any policy that returns `force-handover`. |

### Routing pseudologic ([src/lib/agent/orchestrator.ts](../src/lib/agent/orchestrator.ts))

```
fn plan(input):
  policyResult = evaluatePolicies(input)

  // Priority order — higher beats lower
  if policyResult.effect == force-incident:
    return INCIDENT_FLAGGED, severity P2, page IT Ops
  if policyResult.effect == force-handover:
    return HUMAN_HANDOVER, route to policy.routedTo
  if policyResult.effect == redact:
    return FOLLOW_UP, refuse credential collection

  // Default — KB-grounded routing
  if matchesOnboardingIntent(input):
    return FOLLOW_UP with required-fields card
  if hasKBMatch(input):
    return DIRECT_ANSWER with sources, confidence VERY_HIGH
  return TICKET_CREATED, route to L2 generalist, confidence MEDIUM
```

### Confidence

Five levels (`low`, `med`, `high`, `very-high`, `verified`). Anything below `high` cannot reach `direct-answer` — it falls through to follow-up or ticket creation. Confidence is rendered as a 5-segment bar so non-numeric viewers can read it at a glance.

### Audit trail

Every classification, policy match, model call, and external page produces an `AuditEntry` with `actor`, `action`, `target`, and structured `meta`. The drawer is reachable from the chat composer and (in the spec) from any ticket detail page. PII is redacted at write time.

---

## 7. Three Demonstrable Case Flows

All three are wired in [src/lib/mock-data.ts](../src/lib/mock-data.ts) → `caseFlows[]` and play in `ChatView`.

### 7.1 Password reset (deflection)

- **User question:** "Hi, I'm locked out. Need to reset my company password."
- **Agent classification:** `direct-answer`, confidence `very-high`.
- **Policies triggered:** `P-FAQ-DEFLECT`, `P-NO-PII-IN-CHAT` (passive).
- **Risk assessment:** Low — single user, FAQ pattern, KB-014 fresh (reviewed 2026-04-12).
- **Agent response:** Links self-service NordID portal, offers MFA fallback path.
- **Next step:** None — user resolves it themselves.
- **Logged:** `INC-204812` deflected, audit entries `A-7741..A-7743`.
- **Outcome:** Deflected. Counted in `slo-deflection`.

### 7.2 Onboarding new consultant (structured ticket)

- **User question:** "A new consultant starts on Monday and needs a laptop and access to our systems."
- **Agent classification:** `follow-up` → `ticket-created`, confidence `high`.
- **Policies triggered:** `P-ONBOARD-STRUCTURED`, `P-CONFIRM-BEFORE-CREATE`.
- **Risk assessment:** Medium — 6-month engagement, NordTrack access required.
- **Agent response:** Returns a 6-question intake card (5 required, 1 optional). After the user answers, drafts `REQ-204791` with full structure and routes to L2 Endpoint team.
- **Next step:** L2 stages laptop, IAM creates NordID, NordTrack admin grants L1 role.
- **Logged:** `REQ-204791` queued-l2.
- **Outcome:** Escalated cleanly. Counted in `slo-escalation-quality`.

### 7.3 Possible NordTrack incident (forced handover)

- **User question:** "NordTrack won't let me in. Two of my colleagues say the same. Login spins forever."
- **Agent classification:** `incident-flagged`, confidence `high`.
- **Policies triggered:** `P-MULTI-USER-PATTERN`, `P-P1P2-NEVER-AUTONOMOUS`.
- **Risk assessment:** High — multi-user pattern + auth subsystem keywords.
- **Agent response:** **Refuses to attempt resolution.** Acknowledges, opens incident, pages on-call, asks user not to retry to avoid load.
- **Next step:** IT Ops on-call (Anna Berg) paged via Opsgenie; bridge opened; status page updated.
- **Logged:** `INC-204803` incident, audit entries `A-7751..A-7753`.
- **Outcome:** Escalated as P2 incident. Counted in `slo-safe-escalation` (must remain 100 %).

---

## 8. SLO and Readiness Dashboard

All eight metrics shipped in [src/lib/mock-data.ts](../src/lib/mock-data.ts) → `slos[]`. Each card carries a tooltip with definition and the literal "why CAB cares" text.

| Label | Definition | Example | Status logic | Why CAB cares |
|---|---|---|---|---|
| **Availability** | % minutes agent endpoint responds within budget | 99.42 % | `≥ 99.0 %` healthy | Below target → rollback consideration. |
| **First response ≤ 10 s** | % conversations where first agent reply < 10 s | 96.8 % | `≥ 95 %` healthy | Slow responses break perceived value over Teams/email. |
| **Deflection rate** | % cases resolved without human handover | 43.5 % | `≥ 40 %` healthy | Primary value driver. < 40 % invalidates the business case. |
| **Escalation quality** | % escalated tickets with required structured fields | 88.2 % | `≥ 90 %` healthy, 80–90 % watch | Bad escalations push work back to L1. |
| **Safe escalation (P1/P2)** | % P1/P2 reaching a human within 60 s | 100 % | `= 100 %` healthy | Hard guardrail. Anything below is rollback. |
| **KB ownership coverage** | % KB articles with owner + valid review date | 94 % | `= 100 %` healthy, 90–99 % watch | Stale articles cause hallucinations. |
| **Inference cost / 1k cases** | Estimated cost per 1 000 handled cases | 38 SEK | `≤ 50 SEK` healthy | Local model lowers token risk vs. Lumeon API. |
| **Local inference load** | Avg GPU utilization on inference node | 41 % | `< 70 %` healthy | Headroom for incident traffic. |

---

## 9. Risk and Control Model

Full register at [src/lib/mock-data.ts](../src/lib/mock-data.ts) → `risks[]`.

| ID | Risk | Scenario | Control | UI indicator | Owner | Escalation |
|---|---|---|---|---|---|---|
| R-01 | Incorrect AI answer / hallucination | Agent answers outside KB scope | Confidence threshold + KB-grounding required | Confidence + sources on every response | Karl Eek | Karl → Anna → CIO |
| R-02 | Poor escalation | L2 receives missing-field tickets | Escalation quality SLO ≥ 90 %, blocking validation | Escalation quality metric | Karl Eek | L2 lead → Karl |
| R-03 | Local model failure | OOM / corrupt weights | Health probe 30 s; degraded → silent route to L1 | `ModelStatusPanel` + system banner | Karl Eek | Karl → Anna → on-call |
| R-04 | Hosting failure (CloudFrame) | Regional outage | Documented manual fallback to L1 channels | Hosting status row in side rail | Anna Berg | Anna → CIO |
| R-05 | P1/P2 stuck with the agent | Agent attempts resolution instead of paging | Hard policy `P-P1P2-NEVER-AUTONOMOUS` | `slo-safe-escalation` at 100 % | Karl + Anna | Auto-page IT Ops on-call |
| R-06 | Sensitive info exposure | User pastes credentials | PII pattern detection + redaction in audit | Redaction badge in audit drawer | Karl Eek | Karl → CISO function (Anna) |
| R-07 | Loss of trust if service fails | Visible bad answer in sensitive area | Hypercare 14 days, daily review of low-confidence + escalated cases | Hypercare ribbon on dashboard | Martin Lindqvist | CIO direct |

---

## 10. Local Model Implementation

Layered, swappable, no external services required for the mockup.

```
Frontend (React + TS, Vite, Tailwind v4, shadcn primitives)
  └── Views call into Agent Orchestrator
        └── Orchestrator runs Policy Engine first, then asks LocalModelAdapter
              └── LocalModelAdapter (interface) — Mock / LocalLlama / Lumeon implementations
        └── Audit Trail collector writes structured AuditEntry on every step
Mock Ticket System  — in-memory data in mock-data.ts
Mock Knowledge Base — in-memory data in mock-data.ts
Evaluation harness  — replay caseFlows[] through the orchestrator and snapshot decisions
```

### Folder structure (current)

```
src/
├── App.tsx                 — view router (state-based)
├── main.tsx
├── index.css               — Tailwind v4 + @theme tokens, light/dark, motion utilities
├── lib/
│   ├── types.ts            — domain types (Ticket, AgentDecision, SLOMetric, …)
│   ├── mock-data.ts        — single source of mock truth
│   ├── theme.tsx           — color-mode context + persistence
│   ├── utils.ts            — cn() + formatRelative/formatTime/formatPct
│   ├── adapters/
│   │   └── LocalModelAdapter.ts   — interface + Mock + LocalLlama sketch
│   └── agent/
│       ├── policy-engine.ts       — declarative rules + evaluator
│       └── orchestrator.ts        — single decision point
├── components/
│   ├── layout/             — TopNav, SideRail, AppShell
│   ├── ui/                 — shadcn primitives (Button, Card, Badge, Sheet, Tabs, Tooltip, Input)
│   ├── atoms/              — ConfidenceBar, ClassificationBadge
│   ├── chat/               — AgentMessage, CaseContextCard, TicketDraftCard, KBLinkCard,
│   │                         FollowUpCard, EscalationBanner, AuditTrailDrawer
│   ├── dashboard/          — SLOMetricCard, EscalationQueue, ModelStatusPanel
│   └── readiness/          — ReadinessGate
└── views/
    ├── ChatView.tsx
    ├── IncidentView.tsx
    ├── SLOView.tsx
    ├── KBView.tsx
    ├── RiskView.tsx
    ├── ReadinessView.tsx
    └── AdminView.tsx

docs/
└── spec.md                 — this file
```

### When wiring a real model

Implement `LocalModelAdapter` against `llama.cpp` (already sketched in `LocalLlamaAdapter`). Swap `defaultAdapter` in `LocalModelAdapter.ts`. UI will not change — the orchestrator is the only consumer.

---

## 11. Component List

| Component | Purpose | Props / data | Interactions | Design note |
|---|---|---|---|---|
| `AppShell` | Layout shell | `current`, `onNavigate`, `children` | navigation | Top nav + side rail + grain overlay |
| `TopNav` | Brand, status pill, search hint, theme toggle, user | `useTheme()` | toggle theme | Backdrop blur over `bg/85` |
| `SideRail` | Three-group navigation + footer status | `current`, `onNavigate` | switch view | Active state uses accent on icon, surface-2 on row |
| `AgentChatPanel` (`ChatView`) | Conversation surface + scenario picker | scenario selection state | step / reset | Three-column XL layout, two-column LG |
| `CaseContextCard` | Active case header — channel, requester, tags | `employee`, `channel`, `caseTitle`, `description` | static | Border-bottom anchor for the case |
| `AgentMessage` | Renders user / agent / system message | `msg: ChatMessage` | none | User: dark bubble, agent: surface bubble + sparkle avatar + classification + confidence |
| `TicketDraftCard` | Inline structured ticket | `ticket: Ticket` | "Open ticket" link | Accent-tinted card so it stands out from messages |
| `EscalationBanner` | Forced-handover or incident-flag attachment | `severity`, `service`, `routedTo`, `reason` | static | Critical (P1/P2): danger; otherwise warning |
| `KBLinkCard` | Sources the agent grounded in | `sources: KBSource[]` | links | Article ID + revision date in mono |
| `FollowUpCard` | Required-fields intake | `questions[]` | static (mockup) | Numeric prefix + required/optional pill |
| `ConfidenceBar` | 5-segment confidence indicator | `level: ConfidenceLevel` | none | Color shifts low→warning, mid→accent, high→success |
| `ClassificationBadge` | Decision-type chip | `type: DecisionType` | none | Icon + label, tone derived from type |
| `AuditTrailDrawer` | Right-side sheet of audit entries | `filterTicketId?` | open/close, scroll | Timeline with actor badges and JSON-pretty meta |
| `SLOMetricCard` | Single SLO with sparkline | `slo: SLOMetric` | hover info tooltip | Hero numeral in `Inter Display`, sparkline matches status color |
| `EscalationQueue` | Live ticket queue table | `tickets[]` (from data) | row hover | Tight table, monospace IDs |
| `ModelStatusPanel` | Model + adapter + cost + latency | `modelStatus` | none | Pulse-soft on reachable indicator |
| `ReadinessGate` | One CAB gate | `gate: ReadinessGate` | none | Color-coded by status; evidence card inset |
| `RiskRegisterTable` (`RiskView`) | Risk register with inherent/residual | `risks[]` | row hover | Sorted by residual descending |
| `KnowledgeBaseHealthCard` (`KBView`) | KB health table + coverage hero | `kbArticles[]` | none | Banner on `< 100 %` |
| `Button`, `Card`, `Badge`, `Sheet`, `Tabs`, `Tooltip`, `Input`, `Separator` | shadcn primitives | std | std | All wired to NordIQ tokens |

---

## 12. Mock Data

Examples — full data in [src/lib/mock-data.ts](../src/lib/mock-data.ts).

### Ticket
```json
{
  "id": "REQ-204791",
  "createdAt": "2026-05-05T07:51:48Z",
  "channel": "email",
  "requester": { "id": "e-1188", "name": "Sofia Hellström", "department": "HR" },
  "summary": "Onboarding — Henrik Roos (consultant, 6 mo)",
  "category": "onboarding",
  "affectedService": "Multiple",
  "priority": "P3",
  "status": "queued-l2",
  "proposedNextAction": "L2 Endpoint stages laptop, IAM creates NordID, NordTrack admin grants L1 role.",
  "confidence": "high",
  "assignee": "L2 — Endpoint team",
  "tags": ["onboarding", "consultant", "structured"]
}
```

### SLO metric
```json
{
  "id": "slo-safe-escalation",
  "label": "Safe escalation (P1/P2)",
  "definition": "% of P1/P2 cases that reach a human within 60s.",
  "unit": "%",
  "current": 100,
  "target": 100,
  "status": "healthy",
  "trend": [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  "whyCABCares": "Hard guardrail. Anything below 100 % is a rollback condition, no exceptions."
}
```

### Knowledge base article
```json
{
  "id": "KB-052",
  "title": "Order replacement laptop",
  "category": "device",
  "owner": "—",
  "reviewedAt": "2025-08-15",
  "nextReviewDue": "2026-02-15",
  "usageLast30d": 64,
  "status": "missing-owner"
}
```

### Stakeholder
```json
{
  "id": "anna",
  "name": "Anna Berg",
  "role": "IT Ops Lead",
  "department": "IT Operations",
  "email": "anna.berg@nordtech.se",
  "initials": "AB"
}
```

### Risk
```json
{
  "id": "R-05",
  "risk": "P1/P2 stuck with the AI",
  "scenario": "Agent attempts to resolve a P1/P2 instead of paging humans.",
  "control": "Hard policy: any multi-user pattern or auth/network keyword triggers incident-flag, never autonomous resolution.",
  "uiIndicator": "Safe escalation SLO at 100 % — any breach pages CIO.",
  "owner": "Karl Eek + Anna Berg",
  "escalationPath": "Auto-page IT Ops on-call",
  "inherent": "critical",
  "residual": "low"
}
```

### Agent decision
```json
{
  "id": "AD-9983",
  "ticketId": "INC-204803",
  "type": "incident-flagged",
  "confidence": "high",
  "rationale": "Multiple reports for the same service within 10 min window + auth subsystem error code. Matches incident pattern I-NORDTRACK-AUTH. Hands off — does not attempt resolution.",
  "policiesTriggered": ["P-MULTI-USER-PATTERN", "P-P1P2-NEVER-AUTONOMOUS", "P-INCIDENT-PAGE-OPS"],
  "sources": [{ "articleId": "RB-007", "title": "Runbook: NordTrack auth degradation", "reviewedAt": "2026-04-28" }],
  "modelLatencyMs": 980,
  "timestamp": "2026-05-05T08:02:59Z"
}
```

### Readiness gate
```json
{
  "id": "g-rollback",
  "label": "Rollback tested",
  "description": "Switch to legacy first-line-only mode in < 5 min, confirmed end-to-end.",
  "owner": "Karl Eek, Dev Lead",
  "status": "passed",
  "evidence": "Rollback rehearsal log RB-2026-04-30.md.",
  "signedOffAt": "2026-04-30"
}
```

---

## 13. Visual Design Direction

### Layout
- App shell: sticky 56 px top nav + 244 px side rail + main canvas. No fixed sidebars on chat (which uses a 3-column XL layout: scenario rail / conversation / context).
- Page max widths: 1280 px (CAB), 1400 px (ops). Generous gutters at 24 / 40 px.
- CAB readiness uses a 12-column asymmetric grid: hero verdict 8 / hero metric 4.

### Color principles
- Surfaces: `bg`, `surface`, `surface-2`, `surface-3` form a 4-step depth ladder (light: 98.5 % → 93.5 %; dark: 15 % → 26 %).
- Borders: `border` (rest), `border-strong` (focused, separators). Always 1 px.
- Accent applied sparingly: link text, active nav icon, primary CTA (`accent` button). Never as background field of a hero unless wrapped in border + low-saturation soft variant.
- Status follows a strict tone map: success (forest green), warning (amber), danger (brick red). Each has soft + border variants for filled badges and tinted cards.

### Typography
- Display / hero: `Inter Display` 32–56 px, tracking `-0.025em`. Used in CAB hero and view H1.
- Body: `Inter` 13 px (`text-sm` overall app default).
- Eyebrows / section labels: 10 px `font-semibold uppercase tracking-[0.16em]` in `--color-fg-subtle`.
- Data / IDs / timestamps: `JetBrains Mono` 10–12 px with `tabular-nums`.

### Spacing
- Card padding: 16 px (`p-4`) for dense, 20 px (`p-5`) for medium, 24 px (`p-6`) for hero.
- Vertical rhythm in views: 24 px between sections, 16 px inside.
- Field/Value pairs: 4 px between, 16–24 px between adjacent pairs.

### Cards
- Default: 1 px border on `--color-border`, `radius-lg` (12 px), shadow `xs` at rest, `sm` on hover.
- Tinted cards (ticket draft, incident banner, readiness condition strip) use the soft variant of their tone for fill, the matching border token, and avoid shadow.

### Status indicators
- Always color + icon + label together.
- 1.5 px square (rounded `[2px]`) for confidence bar segments — reads at small sizes.
- 1.5 px round dot for liveness (operational, model reachable).

### Icons
- `lucide-react` only. Sized `h-3 w-3` (in badges), `h-3.5 w-3.5` (in section eyebrows), `h-4 w-4` (in primary actions).
- No emoji icons anywhere.

### Microinteractions
- Spring `stiffness 110, damping 22` on enter; 200 ms color transitions on status flips.
- Agent "thinking" — three dots + caption `classifying · grounding · drafting`, plus sparkle pulse.
- Hover lift: `translate-y-px` on actionable cards; underline on links only on hover.
- Scrollbar: 10 px, transparent track, themed thumb, 2 px transparent border so it floats over content.

### Accessibility
- Focus rings: `2 px` ring in accent on `focus-visible`, with 2 px offset against `bg`.
- All status communicated three ways (color, icon, label).
- Tabular numerals on every metric for clean alignment.
- Color contrast verified WCAG AA on light and dark.
- Subtle grain overlay capped at `opacity 0.025` and `mix-blend-mode: multiply` so it never hurts contrast.

---

## 14. CIO/CAB Demo Script

Estimated runtime: 6 minutes.

1. **Open at CAB Readiness (default landing).** "This is the page that decides go-live. Conditional Go — five of eight gates passed, the two pending items are tracked, two will close inside hypercare. Recommendation: approve with conditions and 14 days of hypercare." *(15 s)*

2. **Point to the Conditions strip.** "These are the things we are committing to before unconditional go-live. Daily review, KB to 100 %, escalation quality to 90 %, rollback drill on day 1 and day 7." *(20 s)*

3. **Scroll to Sign-off chain.** "Three of five signers in. Erik for cost, Lina for HR knowledge — both scheduled this week." *(15 s)*

4. **Switch to Agent chat → Password reset.** Click `Step` to play the conversation. "FAQ deflection. KB-grounded, very-high confidence, logged as deflected. This is the 40 % we are removing from L1." *(45 s)*

5. **Switch to Onboarding scenario, play through.** "When the user gives a structured request, the agent doesn't guess — it asks for what's missing, then drafts a real ticket. The L2 Endpoint team gets a complete brief instead of chasing the requester." *(60 s)*

6. **Switch to NordTrack incident, play through.** "Same agent, very different behavior. Multi-user pattern + auth keywords — the agent refuses to fix it, opens the bridge, pages Anna. This is policy `P-P1P2-NEVER-AUTONOMOUS` doing exactly what it's supposed to." *(45 s)*

7. **Open Audit trail drawer from chat composer.** "Every classification, every policy match, every page is captured here. PII redacted at write time." *(30 s)*

8. **Jump to SLO & operations.** "Live SLOs. Hover any card for the definition and why it matters to CAB. Safe escalation at 100 % is the hard guardrail. Cost is well below the CFO ceiling." *(45 s)*

9. **Jump to Risk register.** "Inherent risk left of residual. The two `critical` inherent rows — model failure and P1/P2 stuck with AI — are now `low` residual because of named controls in the UI." *(30 s)*

10. **Jump to Model & policy.** "Current adapter is `llama3:8b-instruct`, local. The seam to swap is one toggle here. The system prompt is read-only and visible — no hidden behavior." *(30 s)*

11. **Back to CAB Readiness.** Hand to CIO. "Recommendation stands: Conditional Go." *(15 s)*

---

## 15. Definition of Done

The mockup is ready to demo to CIO / CAB when:

- [x] All seven views render in light *and* dark mode.
- [x] Every interactive element has a visible focus state.
- [x] Three case flows play end-to-end without errors and surface: classification badge, confidence bar, KB sources (where applicable), ticket draft (onboarding), incident banner with policy ID (NordTrack).
- [x] CAB Readiness shows a clear verdict, gates progress (5 / 8), conditions strip, sign-off chain.
- [x] SLO dashboard shows all eight metrics with sparklines and "why CAB cares" tooltips.
- [x] Risk register lists inherent and residual side-by-side with named owners.
- [x] Knowledge base view shows coverage % and flags missing-owner / stale articles.
- [x] Audit drawer opens, lists actor + action + meta, scrollable.
- [x] Model & policy view shows active adapter, alternative adapters, full policy rules with effect kind, read-only system prompt.
- [x] No data in the UI is real (no real names, costs, or supplier statuses).
- [x] App runs locally via `npm install && npm run dev` with no cloud dependencies.
- [x] Type-check passes (`npm run typecheck`).
- [ ] (Optional, post-demo) `LocalLlamaAdapter` wired against an actual local llama.cpp endpoint.
- [ ] (Optional, post-demo) Evaluation harness that replays case flows and snapshots agent decisions.
