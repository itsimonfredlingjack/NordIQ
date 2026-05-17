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

Det här är GitHub-versionen av NordIQ:s **Go-Live Readiness Package**. Källan för paketets struktur och innehåll är [NordIQ_Go-Live_Readiness_Package-v2.md](NordIQ_Go-Live_Readiness_Package-v2.md). README fungerar som ingång till presentationen, dokumenten och Mermaid-flödena, inte som en ny version av uppgiften.

NordIQ beskrivs som en intern IT-tjänst för NordTech AB, inte som en fristående chatbot eller teknikdemo. Paketet ska ge CIO och CAB ett beslutsunderlag för **villkorad go-live**, där kvarstående risker, verifieringsbehov och rollback-väg är synliga innan produktion.

Go-live är alltså inte godkänd i detta repo. Värden som inte är verifierade ska läsas som **targets**, **go/no-go criteria**, **assumptions** eller **verification needs**.

---

## Service Definition

NordIQ är en AI-stödd intern first-line supporttjänst som gör det möjligt för NordTechs medarbetare att få snabbare hjälp med vanliga IT-supportbehov, utan att behöva vänta på manuell first-line-hantering eller förstå vart ärendet ska routas.

Tjänsten ska ta emot supportförfrågningar, klassificera dem, besvara återkommande ärenden när Knowledge Base räcker och eskalera ärenden som kräver mänsklig hantering till rätt supportflöde.

NordIQ:s servicevärde ligger i kortare väntetid, lägre belastning på first line och tydligare escalation när AI-agenten inte ska eller kan lösa ärendet själv.

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
| Service ambition | 24/7 entry point för first-line support |
| Hosting dependency | CloudFrame Nordic hostar AI Agent Platform |
| LLM dependency | Lumeon API är LLM API-beroende |

---

## Package Artifacts

| # | Artifact | Purpose | Contains | File |
|---|----------|---------|----------|------|
| 1 | **Cover & Snapshot** | Describes NordIQ in service language, not as a stack. | Service Definition, Stakeholder Map, Value · Utility · Warranty, The Four Dimensions | [docs/1. Cover & Snapshot.md](docs/1.%20Cover%20%26%20Snapshot.md) |
| 2 | **Service Levels** | Defines what "good enough" means before go-live. | Internal SLOs, rationale per target, how each is measured, Service Request Handling | [docs/2. Service Levels.md](docs/2.%20Service%20Levels.md) |
| 3 | **Operational Readiness** | Shows how NordIQ runs day-to-day and recovers when it breaks. | Major-Incident Playbook, Problem-Management Approach, Continual Improvement Register, On-call & Escalation Map | [docs/3. Operational Readiness.md](docs/3.%20Operational%20Readiness.md) |
| 4 | **Change & Release** | Defines the plan to take NordIQ into production and back out. | RFC for go-live, CAB Design, Go/No-Go Criteria, Rollback Plan | [docs/4. Change & Release.md](docs/4.%20Change%20%26%20Release.md) |

Det finns inga extra huvudartefakter i denna karta. Risker, stakeholders, Continual Improvement och CAB-berättelsen hanteras inom de fyra delarna ovan.

---

## Readiness Flow

```mermaid
flowchart LR
    A[1. Cover & Snapshot<br/>Service Definition<br/>Stakeholders & Value Statements<br/>The Four Dimensions<br/>Utility vs Warranty] --> B

    B[2. Service Levels<br/>Internal SLOs<br/>Service Request Handling<br/>SLO targets och mätning] --> C

    C[3. Operational Readiness<br/>Major-Incident Playbook<br/>Problem-Management Approach<br/>Communication Plan<br/>PIR<br/>Continual Improvement<br/>On-call] --> D

    D[4. Change & Release<br/>CAB Design<br/>Go / No-Go Criteria<br/>RFC<br/>Change Enablement / Rollback Plan] --> E

    E{CAB-beslut<br/>Martin Lindqvist<br/>Change Authority}

    E -->|Go| F[NordIQ go-live<br/>om villkor är stängda]
    E -->|Go med villkor| G[Villkor hanteras<br/>innan release]
    E -->|No-go| H[Ny RFC-cykel]

    F --> I[Hypercare<br/>SLO-uppföljning<br/>incident och deflection]
    G --> E
    H --> A

    I --> J{Rollback-trigger?}
    J -->|Nej| K[Business as usual<br/>Continual Improvement<br/>Problem Management]
    J -->|Ja| L[Rollback<br/>NordIQ offline<br/>SharePoint FAQ<br/>manuell first line]
    L --> H

    style A fill:#e3f2fd,stroke:#2196F3
    style B fill:#e3f2fd,stroke:#2196F3
    style C fill:#e3f2fd,stroke:#2196F3
    style D fill:#e3f2fd,stroke:#2196F3
    style E fill:#fff9c4,stroke:#F9A825
    style F fill:#e8f5e9,stroke:#4CAF50
    style G fill:#fff3e0,stroke:#F97316
    style H fill:#ffebee,stroke:#F44336
    style L fill:#ffebee,stroke:#F44336
```

Mermaid source: [diagrams/Go-Live Readiness Package.mmd](diagrams/Go-Live%20Readiness%20Package.mmd)

---

## Service Request Handling

```mermaid
flowchart TD
    A[Medarbetare<br/>NordTech AB] -->|Teams / e-post / webbportal| B[Submit<br/>Ärende registreras direkt]

    B --> C[Triage<br/>NordIQ klassificerar inom 2 sek]

    C -->|FAQ / återkommande ärende| D[Fulfill<br/>AI-agenten ger svar]
    C -->|Request / Change| E[Approve<br/>Chef, budgetägare, security eller dataägare]
    C -->|Incident / okänt / osäkert ärende| F[Assign<br/>Eskalering till Anna Berg / IT Ops inom 2 min]

    E --> G[Assign<br/>Routas till rätt fulfiller]
    G --> H[Fulfill<br/>AI-agent, IT Ops, Incident Management,<br/>Change Enablement, Dev eller leverantör]

    D --> I[Verify<br/>Användarbekräftelse eller kontroll]
    H --> I
    F --> H

    I --> J[Close<br/>Ärende stängs]
    J --> K[Kunskapslucka eller återkommande fel]
    K --> L[Knowledge Base uppdateras<br/>inom 24 h]
    K --> M[Continual Improvement Register]

    C -->|AI/API/Knowledge Base-avbrott| N[Failover<br/>SharePoint FAQ + manuell ticket]
    N --> F

    style A fill:#e8f4fd,stroke:#2196F3
    style C fill:#fff3e0,stroke:#F97316
    style D fill:#e8f5e9,stroke:#4CAF50
    style F fill:#ffebee,stroke:#F44336
    style N fill:#ffebee,stroke:#F44336
    style L fill:#f3e5f5,stroke:#9C27B0
    style M fill:#f3e5f5,stroke:#9C27B0
```

Mermaid source: [diagrams/2.2 Service Request Handling.mmd](diagrams/2.2%20Service%20Request%20Handling.mmd)

---

## On-call & Escalation Map

```mermaid
flowchart TD
    A[Incident upptäcks<br/>larm eller användarrapport] --> B[First point of contact<br/>IT Ops / Anna Berg]

    B --> C[Triage och deklaration<br/>Incident Commander]
    C -->|Major Incident| D[War room inom 15 min<br/>Anna / Karl / IC / Communications Lead]
    C -->|Ej major incident| E[Normal hantering<br/>IT Ops eller rätt resolver]

    D --> F[Isolering / failover<br/>Karl Eek]
    F -->|Stäng AI-chatten| G[NordIQ offline]
    F -->|Emergency Redirect| H[SharePoint FAQ<br/>+ manuell ticket]

    D --> I[Leverantörskontakt]
    I -->|Hostingproblem| J[CloudFrame Nordic<br/>supplier ticket]
    I -->|LLM/API-problem| K[Lumeon API<br/>supplier ticket]

    D --> L[Fast Cadence<br/>uppdatering till IC var 30:e min]
    L --> M[Martin Lindqvist<br/>30-minutersstatus vid SEV1]
    L --> N[Erik Holm<br/>leverantör / kostnad]
    L --> O[Anställda<br/>Teams / mail / all-clear]

    J --> P[Upplösning]
    K --> P
    G --> P
    H --> P
    E --> P

    P --> Q[Post-Incident Review<br/>efter SEV1/SEV2]
    Q --> R[Problem Management<br/>5 Whys / Contributing Factors]
    R --> S[Continual Improvement<br/>Knowledge Base uppdateras]

    H -->|Fler än 2 gånger på 30 dagar| T[Problem-ticket<br/>permanent åtgärd]

    style A fill:#fff3e0,stroke:#F97316
    style C fill:#e3f2fd,stroke:#2196F3
    style D fill:#e3f2fd,stroke:#2196F3
    style G fill:#ffebee,stroke:#F44336
    style H fill:#ffebee,stroke:#F44336
    style J fill:#fce4ec,stroke:#E91E63
    style K fill:#fce4ec,stroke:#E91E63
    style Q fill:#e8f5e9,stroke:#4CAF50
    style T fill:#f3e5f5,stroke:#9C27B0
```

Mermaid source: [diagrams/3.6 On-call & Escalation Map.mmd](diagrams/3.6%20On-call%20%26%20Escalation%20Map.mmd)

---

## Common Service Language

| Term | How it is used here |
|------|---------------------|
| **Service** | NordIQ är en intern IT-tjänst som möjliggör snabbare first-line support för NordTechs medarbetare. |
| **Service consumer** | Medarbetare på NordTech som använder NordIQ för IT-supportbehov. |
| **Utility** | Vad NordIQ gör: självbetjäning, triage, escalation och förbättringsdata. |
| **Warranty** | Hur tjänsten måste fungera tillräckligt bra: availability, continuity, korrekt information och fungerande escalation. |
| **SLO / SLI** | SLO är internt mål; SLI är mätvärdet som visar om målet uppnås. |
| **Incident** | Oplanerad händelse som orsakar eller riskerar avbrott i tjänsten eller supportflödet. |
| **Problem Management** | Hantering av bakomliggande orsaker till återkommande incidents. |
| **Change Enablement** | Kontrollerad hantering av förändringen att ta NordIQ mot produktion. |
| **RFC** | Request for Change för NordIQ go-live. |
| **CAB** | Change Advisory Board som ger beslutsunderlag till Change Authority. |
| **Continual Improvement Register** | Register över förbättringar som kommer från incidenter, användarfeedback, SLO-avvikelser och Knowledge Base-luckor. |

För att undvika missförstånd används inte `CI` som kortform för Continual Improvement i README. Om Configuration Item avses ska det skrivas ut som **Configuration Item (CI)**.

---

## Verification Boundary

| Item | Status in this package |
|------|------------------------|
| Go-live approval | Ej beslutat |
| SLO baseline | Behöver mätas i test, pilot eller begränsad rollout |
| Rollback | Dokumenterad som plan och go/no-go-villkor; behöver verifieras |
| CloudFrame Nordic | Hosting dependency; faktisk SLA/supportväg behöver granskas |
| Lumeon API | LLM dependency; SLA, latens och tokenkostnad behöver följas upp |
| Deflection 40-60 % | Target, inte uppmätt resultat |
| Continual Improvement | Register/hantering beskrivs; förbättringar är inte verifierat genomförda |

---

## Mockup

[mockup/](mockup/) innehåller en klickbar medarbetaryta för NordIQ. Mockupen visar servicebeteende och supportflöde, inte produktionsklar LLM-integration eller CAB-godkänd driftberedskap.

```bash
cd mockup
npm install
npm run dev
npm run typecheck
```

---

## How to Use This Repository

1. Läs [NordIQ_Go-Live_Readiness_Package-v2.md](NordIQ_Go-Live_Readiness_Package-v2.md) som källmaterial.
2. Använd de fyra dokumenten i [docs/](docs/) som presentationens artifact-delar.
3. Använd Mermaid-diagrammen i [diagrams/](diagrams/) för GitHub-renderade flöden och diffbara ändringar.
4. Behandla SLO, rollback, supplier constraints och deflection som verifieringspunkter innan CAB kan fatta go/no-go-beslut.
