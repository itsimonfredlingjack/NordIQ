# NordIQ Chat Mockup Specification

> **Mockup specification - current implementation scope.**  
> This document describes the runnable chat-only mockup in this repo. It does not claim that CAB, SLO, risk, knowledge base, or admin dashboards exist in the current app.

---

## 1. Product Idea

NordIQ is an internal AI-assisted service desk for NordTech AB. The mockup demonstrates the employee-facing service surface: a regular employee asks for help, the agent either answers from a knowledge source, asks for missing fields, opens a structured handoff, or escalates to a human.

The school case treats NordIQ as a governable IT service, not a chatbot experiment. The current mockup supports that by showing a narrow slice of the service behavior:

- **For employees:** common IT questions should be answered quickly when the knowledge basis is strong.
- **For first line:** recurring FAQ-class work should be reduced, not hidden.
- **For second line / IT Ops:** escalated work should arrive with enough structure for a human to act.
- **For CIO / CAB:** the mockup is a demo artifact only; readiness evidence lives in the documents under `docs/`.

---

## 2. Source-Aligned Assumptions

- NordTech AB has approximately 450 employees.
- The current first-line baseline is approximately 70 tickets/day across 4 humans, with 2.5 days average resolution.
- Approximately 40% of tickets are recurring or FAQ-class.
- The target framing is 40-60% first-line deflection, but the mockup does not prove that target.
- CloudFrame Nordic is the hosting platform for the AI Agent Platform.
- Lumeon API is the LLM API for the agent layer.
- Ticket creation/routing in the mockup represents a handoff to an existing ticketing path; the school material does not name that system.
- All people, tickets, KB articles, costs, timestamps, statuses, and policies in the mockup are fictional demo data.

---

## 3. Current Scope

The implemented mockup is a single chat surface. It intentionally does **not** include live dashboards, real monitoring, supplier status, CAB sign-off, SLO evidence, risk workflows, model administration, or real integrations.

Current flow:

```text
Hero state
  -> user chooses one scripted scenario
  -> transcript auto-plays
  -> agent shows direct answer, follow-up, ticket draft, or escalation
  -> user can reset and try another scenario
```

The mockup is useful as a demonstration aid, not as proof that NordIQ is production-ready.

---

## 4. Implemented Scenarios

### 4.1 Password reset

- **User need:** Locked out / password reset.
- **Agent behavior:** Direct answer with a knowledge-base source cue.
- **Service meaning:** Demonstrates the FAQ/deflection pattern.
- **Evidence status:** Demo-only. It does not prove actual deflection rate.

### 4.2 Onboarding new consultant

- **User need:** A new consultant needs laptop and access.
- **Agent behavior:** Asks for missing fields, then drafts a structured ticket/handoff.
- **Service meaning:** Demonstrates request intake and structured escalation.
- **Evidence status:** Demo-only. HR workflow and subject-matter review are not verified by the mockup.

### 4.3 Possible NordTrack incident

- **User need:** Multiple users cannot log in.
- **Agent behavior:** Refuses to treat it as a simple FAQ, opens a human handoff path.
- **Service meaning:** Demonstrates that possible incident patterns should not stay with the AI agent.
- **Evidence status:** Demo-only. P1/P2 escalation must still be verified outside the mockup.

---

## 5. Behavior Model

The mockup uses scripted data, not a production LLM call. It demonstrates intended behavior categories:

| Behavior | Intended meaning |
|----------|------------------|
| Direct answer | The question matches a safe, knowledge-grounded FAQ pattern. |
| Follow-up | The request is understandable but missing required fields. |
| Ticket draft | A human team needs to act, so the agent prepares structured handoff data. |
| Human handoff | The request is sensitive, uncertain, or incident-like. |

Production architecture must treat Lumeon API as the LLM API for the agent layer. Any local/mock model behavior in the app is implementation scaffolding for a demo, not the case architecture.

---

## 6. Trust Boundaries

The mockup should not be read as security or compliance evidence. These are expected production concerns, not verified controls in this repo:

- authentication and authorization;
- handling of personal data;
- prompt injection and unsafe user input;
- audit log retention;
- supplier status and incident reporting;
- rollback and manual fallback.

Those concerns belong in the Go-Live Readiness Package documents and must be verified before CAB.

---

## 7. Design Direction

The chat UI should stay quiet and operational:

- restrained visual hierarchy;
- no marketing hero or decorative dashboard claims;
- inline cues for answer / follow-up / handoff state;
- knowledge source cues that are visible without looking like formal evidence;
- escalation language that is calm and direct.

The mockup should remain a small demonstrator of the employee surface unless the assignment explicitly requires a broader app.

---

## 8. Run

```bash
cd mockup
npm install
npm run dev
npm run typecheck
```

Running the mockup only validates the demo UI. It does not validate SLOs, supplier readiness, security controls, rollback, or CAB approval.
