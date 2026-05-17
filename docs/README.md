# NordIQ Docs Portal

Det här är dokumentnavet för NordIQ Go-Live Readiness Package. Rotens [README](../README.md) visar den renderade översikten med Mermaid-flöden; den här sidan pekar till källartefakterna som CAB-underlaget består av.

## Reading Order

| Order | Artifact | File | Use for |
|-------|----------|------|---------|
| 1 | Executive Summary | [00-executive-summary.md](00-executive-summary.md) | Snabb CAB-orientering: beslut, rekommendation, nytta, risk och villkor. |
| 2 | Service Snapshot | [01-service-snapshot.md](01-service-snapshot.md) | Service definition, consumers, stakeholders, value, utility, warranty och Four Dimensions. |
| 3 | Service Levels & SLOs | [02-service-levels-slo.md](02-service-levels-slo.md) | Mål, SLI/SLO, baselinebehov, go/no-go-kriterier och uppföljning. |
| 4 | Operational Readiness | [03-operational-readiness.md](03-operational-readiness.md) | Service request flow, incidentnivåer, major incident playbook, handover och on-call. |
| 5 | Change & Release RFC | [04-change-release-rfc.md](04-change-release-rfc.md) | RFC-NordIQ-001, scope, verifiering före CAB, rollback, hypercare och CAB-beslut. |

## Supporting Registers

| Register | File | Why it matters |
|----------|------|----------------|
| Risk Register | [risk-register.md](risk-register.md) | Visar öppna risker, föreslagna åtgärder, ägare och verifieringsbehov. |
| Continual Improvement Register | [ci-register.md](ci-register.md) | Samlar förbättringar från incidenter, SLO-avvikelser, feedback och Knowledge Base-luckor. |
| Stakeholder Map | [stakeholder-map.md](stakeholder-map.md) | Visar service consumers, interna intressenter, leverantörer och CAB-perspektiv. |
| CAB Presentation Outline | [cab-presentation-outline.md](cab-presentation-outline.md) | Speaker notes för presentationen av villkorad go-live. |
| Reflection | [05-reflection.md](05-reflection.md) | Gruppreflektion och lärdomar. |

## Mermaid Sources

GitHub renderar Mermaid direkt i Markdown, och diagrammens källkod ligger versionerad under `diagrams/`.

| Diagram | Source |
|---------|--------|
| Go-Live Readiness Flow | [../diagrams/go-live-readiness-flow.mmd](../diagrams/go-live-readiness-flow.mmd) |
| Service Flow | [../diagrams/service-flow.mmd](../diagrams/service-flow.mmd) |
| Escalation Map | [../diagrams/escalation-map.mmd](../diagrams/escalation-map.mmd) |

## Verification Rule

Alla värden som inte är verifierade i case- eller testunderlag ska behandlas som **assumptions**, **targets**, **go/no-go criteria** eller **verification needs**.

Det gäller särskilt:

- SLO-baseline;
- rollback-test;
- CloudFrame Nordic SLA/supportväg;
- Lumeon API SLA, latens och tokenkostnad;
- faktisk deflection;
- pilotresultat;
- handover till Anna Berg;
- säkerhets- och personuppgiftskontroller.
