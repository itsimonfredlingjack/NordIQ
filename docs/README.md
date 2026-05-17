# NordIQ Docs

Det här är den uppdelade GitHub-versionen av NordIQ:s **Go-Live Readiness Package**. Källstrukturen är de fyra huvuddelarna i [../NordIQ_Go-Live_Readiness_Package-v2.md](../NordIQ_Go-Live_Readiness_Package-v2.md).

## Package Artifacts

| # | Artifact | File | Role in package |
|---|----------|------|-----------------|
| 1 | Cover & Snapshot | [1. Cover & Snapshot.md](1.%20Cover%20%26%20Snapshot.md) | Service definition, stakeholders, value, utility, warranty och Four Dimensions. |
| 2 | Service Levels | [2. Service Levels.md](2.%20Service%20Levels.md) | Internal SLOs, rationale, mätning och Service Request Handling. |
| 3 | Operational Readiness | [3. Operational Readiness.md](3.%20Operational%20Readiness.md) | Major-Incident Playbook, Problem-Management Approach, Continual Improvement Register och On-call & Escalation Map. |
| 4 | Change & Release | [4. Change & Release.md](4.%20Change%20%26%20Release.md) | RFC, CAB Design, Go/No-Go Criteria och Rollback Plan. |

## Diagram Sources

| Diagram | Source |
|---------|--------|
| Go-Live Readiness Package | [../diagrams/Go-Live Readiness Package.mmd](../diagrams/Go-Live%20Readiness%20Package.mmd) |
| Service Request Handling | [../diagrams/2.2 Service Request Handling.mmd](../diagrams/2.2%20Service%20Request%20Handling.mmd) |
| On-call & Escalation Map | [../diagrams/3.6 On-call & Escalation Map.mmd](../diagrams/3.6%20On-call%20%26%20Escalation%20Map.mmd) |

## Verification Rule

Värden som inte är verifierade i case-, test- eller pilotunderlag ska behandlas som **assumptions**, **targets**, **go/no-go criteria** eller **verification needs**.

Det gäller särskilt SLO-baseline, rollback-test, CloudFrame Nordic SLA/supportväg, Lumeon API SLA/latens/tokenkostnad, faktisk deflection, handover och driftberedskap.
