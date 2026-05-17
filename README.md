# GO-LIVE READINESS PACKAGE

> **A S S I G N M E N T · I P L 2 5**
> **NordIQ — AI-stödd First-Line Support**
> **NordTech AB**
> **Maj 2026**

**Prepared by**

- Simon Fredling Jack
- Jonas Öhrn
- Emma Hörnberg
- Annika Mellgren
- Filippa Skauby Killick

---

## Service Definition

NordIQ är en AI-stödd intern first-line supporttjänst för NordTech AB:s medarbetare. Tjänsten gör det möjligt för service consumers att få snabbare hjälp med vanliga IT-supportbehov utan att behöva vänta på manuell first-line-hantering eller förstå hur ärendet ska routas internt.

NordIQ tar emot supportförfrågningar, klassificerar dem, besvarar återkommande FAQ-liknande ärenden när Knowledge Base räcker och eskalerar ärenden som kräver mänsklig hantering till rätt supportflöde.

Tjänsten ska skapa värde genom kortare väntetid, lägre repetitiv first-line-belastning och mer strukturerade escalations. NordIQ ersätter inte mänskligt ansvar för kritiska, osäkra eller känsliga ärenden.

---

## Case Baseline

| Area | Case fact |
|------|-----------|
| Organisation | NordTech AB, cirka 450 medarbetare |
| Current first-line volume | Cirka 70 ärenden per dag |
| Current first-line staffing | 4 personer |
| Current average resolution | 2,5 dagar |
| Recurring / FAQ-classified tickets | Cirka 40 % |
| NordIQ target | 40-60 % first-line deflection |
| Service ambition | 24/7 first-line entry point |
| Hosting dependency | CloudFrame Nordic hosts the AI Agent Platform |
| LLM dependency | Lumeon API is the LLM API for the agent layer |

---

## Decision Path

Det här repo:t är docs-as-code: Markdown-filerna är källan, Mermaid-diagrammen renderas direkt i GitHub och ändringar kan granskas som diffar.

```mermaid
flowchart LR
    A[Service Snapshot<br/>Vad är tjänsten?<br/>Vem påverkas?<br/>Utility & Warranty] --> B
    B[Service Levels<br/>SLO, SLI och baselinebehov<br/>Go/No-Go-kriterier] --> C
    C[Operational Readiness<br/>Incident Playbook<br/>Handover-villkor<br/>Escalation] --> D
    D[Change & Release RFC<br/>RFC-NordIQ-001<br/>Verifieringskrav<br/>Rollback-villkor] --> E
    E{CAB-beslut<br/>Är villkoren verifierade?}

    E -->|Ja - villkor stängda| F[GO-LIVE<br/>NordIQ produktionssätts]
    E -->|Villkor kvarstår| G[Begränsad rollout<br/>eller senarelagt go-live<br/>ny verifiering]
    E -->|Kritiska blockerare| H[Go-live skjuts upp<br/>root cause åtgärdas<br/>ny RFC-cykel]

    G --> E
    H --> A
    F --> I[Hypercare<br/>förstärkt uppföljning<br/>SLO-granskning]
    I --> J[Business as Usual<br/>Continual Improvement<br/>SLO-uppföljning<br/>supplier constraints]

    style A fill:#e3f2fd,stroke:#2196F3
    style B fill:#e3f2fd,stroke:#2196F3
    style C fill:#e3f2fd,stroke:#2196F3
    style D fill:#e3f2fd,stroke:#2196F3
    style E fill:#fff9c4,stroke:#F9A825
    style F fill:#e8f5e9,stroke:#4CAF50
    style G fill:#fff3e0,stroke:#F97316
    style H fill:#ffebee,stroke:#F44336
    style I fill:#f3e5f5,stroke:#9C27B0
    style J fill:#e8f5e9,stroke:#4CAF50
```

Mermaid source: [diagrams/go-live-readiness-flow.mmd](diagrams/go-live-readiness-flow.mmd)

---

## Artifact Map

| CAB question | Artifact | File |
|--------------|----------|------|
| What is the service and value case? | Cover & Snapshot / Service Snapshot | [docs/01-service-snapshot.md](docs/01-service-snapshot.md) |
| What does "good enough" mean before go-live? | Service Levels & SLOs | [docs/02-service-levels-slo.md](docs/02-service-levels-slo.md) |
| How does NordIQ run and recover when it breaks? | Operational Readiness | [docs/03-operational-readiness.md](docs/03-operational-readiness.md) |
| What is the change, who decides, and how do we back out? | Change & Release / RFC | [docs/04-change-release-rfc.md](docs/04-change-release-rfc.md) |
| What risks remain? | Risk Register | [docs/risk-register.md](docs/risk-register.md) |
| How are improvements tracked? | Continual Improvement Register | [docs/ci-register.md](docs/ci-register.md) |
| Who is affected and how should they be handled? | Stakeholder Map | [docs/stakeholder-map.md](docs/stakeholder-map.md) |
| How should the CAB story be presented? | CAB Presentation Outline | [docs/cab-presentation-outline.md](docs/cab-presentation-outline.md) |

Docs portal: [docs/README.md](docs/README.md)

---

## Service Request Flow

```mermaid
flowchart TD
    A[Medarbetare<br/>NordTech AB] -->|Teams / mejl / webbportal| B[NordIQ<br/>AI-agent]

    B -->|Svar hittas i Knowledge Base| C[Direkt svar<br/>levereras]
    B -->|Okänt ärende eller komplex fråga| D[Strukturerad ticket<br/>skapas i befintligt ärendehanteringssystem]
    B -->|P1/P2 eller osäkert ärende| E[Omedelbar escalation<br/>till människa]

    C -->|Medarbetaren bekräftar lösning| F[Feedback samlas]
    C -->|Ny kunskapslucka| G[Knowledge Base<br/>uppdateras]

    D -->|Routa till rätt grupp| H[Second line<br/>eller specialist]
    H -->|Lösning bekräftad| I[Ärende stängt<br/>i befintligt ärendehanteringssystem]
    I --> G

    E --> J[On-call / Anna Berg<br/>eller Karl Eek]
    J -->|Löst| I
    J -->|Hostingproblem| K[CloudFrame Nordic<br/>hostingplattform]
    J -->|LLM/API-problem| L[Lumeon API<br/>LLM API för agentlagret]
    K -->|Löst| I
    L -->|Löst| I

    G -->|Förbättrar framtida svar| B

    style A fill:#e8f4fd,stroke:#2196F3
    style B fill:#fff3e0,stroke:#F97316
    style C fill:#e8f5e9,stroke:#4CAF50
    style D fill:#fff3e0,stroke:#F97316
    style E fill:#ffebee,stroke:#F44336
    style F fill:#e8f5e9,stroke:#4CAF50
    style G fill:#f3e5f5,stroke:#9C27B0
    style H fill:#e3f2fd,stroke:#2196F3
    style I fill:#e8f5e9,stroke:#4CAF50
    style J fill:#fff3e0,stroke:#F97316
    style K fill:#fce4ec,stroke:#E91E63
    style L fill:#fce4ec,stroke:#E91E63
```

Mermaid source: [diagrams/service-flow.mmd](diagrams/service-flow.mmd)

---

## Escalation Map

```mermaid
flowchart TD
    A[NordIQ<br/>AI-agent] -->|P1/P2 eller osäkert ärende| B[On-call<br/>first responder]

    B -->|Tekniskt problem<br/>plattform/agentlager| C[Karl Eek<br/>Internal Dev Lead]
    B -->|Driftproblem<br/>SLO-avvikelse| D[Anna Berg<br/>IT Ops Lead]

    C -->|Hostingproblem| E[CloudFrame Nordic<br/>hostingplattform]
    C -->|LLM/API-problem| F[Lumeon API<br/>LLM API för agentlagret]
    C -->|Intern teknisk lösning| G[Löst]

    D -->|P1 olöst eller riskbeslut| H[Martin Lindqvist<br/>CIO / sponsor]
    D -->|HR-påverkan| I[Lina Nordin<br/>Head of HR]
    D -->|Intern driftåtgärd| G

    E --> G
    F --> G
    H -->|Strategiskt beslut<br/>t.ex. rollback| J[Rollback aktiveras<br/>Anna Berg beslutar]
    J --> K[Kommunikation<br/>till medarbetare]

    G --> L[Post-Incident Review<br/>efter P1/P2]
    L --> M[Uppdatera<br/>riskregister och Knowledge Base]

    style A fill:#fff3e0,stroke:#F97316
    style B fill:#e3f2fd,stroke:#2196F3
    style C fill:#e8f4fd,stroke:#2196F3
    style D fill:#e8f4fd,stroke:#2196F3
    style E fill:#fce4ec,stroke:#E91E63
    style F fill:#fce4ec,stroke:#E91E63
    style G fill:#e8f5e9,stroke:#4CAF50
    style H fill:#f3e5f5,stroke:#9C27B0
    style I fill:#f3e5f5,stroke:#9C27B0
    style J fill:#ffebee,stroke:#F44336
    style K fill:#fff3e0,stroke:#F97316
    style L fill:#e8f5e9,stroke:#4CAF50
    style M fill:#e8f5e9,stroke:#4CAF50
```

Mermaid source: [diagrams/escalation-map.mmd](diagrams/escalation-map.mmd)

---

## Verification Boundary

Det här paketet stödjer ett villkorat CAB-beslut. Det ska inte läsas som bevis på att go-live redan är godkänd.

| Item | Status in this package |
|------|------------------------|
| Go-live approval | Ej beslutat |
| SLO baseline | Behöver mätas i test, pilot eller begränsad rollout |
| Rollback | Dokumenterad som villkor, behöver verifieras |
| CloudFrame Nordic | Hosting dependency, faktisk SLA/supportväg behöver granskas |
| Lumeon API | LLM dependency, SLA/latens/tokenkostnad behöver följas upp |
| Deflection 40-60 % | Target, inte uppmätt resultat |
| Continual Improvement | Register finns; förbättringar är inte verifierat genomförda |

---

## Mockup

[mockup/](mockup/) innehåller en klickbar medarbetaryta för NordIQ. Mockupen visar servicebeteende, inte produktionsklar LLM-integration eller CAB-godkänd driftberedskap.

```bash
cd mockup
npm install
npm run dev
npm run typecheck
```
