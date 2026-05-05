# NordIQ – Go-Live Readiness Package

> **Skoluppgift | ITIL | CAB-underlag**  
> Kurs: IT-tjänstehantering | Grupp: [Gruppnamn]

---

## Vad är det här repot?

Det här repot innehåller ett **Go-Live Readiness Package** för tjänsten **NordIQ** – en AI-stödd intern service desk hos det fiktiva bolaget **NordTech AB**.

Paketet är framtaget som beslutsunderlag inför ett CAB-möte (Change Advisory Board) och riktar sig primärt till CIO Martin Lindqvist och övriga beslutsfattare.

---

## Case: NordTech AB & NordIQ

**NordTech AB** är ett medelstort teknikföretag med ca 800 medarbetare och en centraliserad IT-organisation. Företaget vill minska trycket på first-line support och förbättra tillgängligheten för medarbetare utanför kontorstid.

**NordIQ** är en intern AI-stödd service desk som integreras med Teams, mejl och en webbportal. Den hanterar vanliga IT-ärenden dygnet runt och eskalerar strukturerat till rätt supportnivå när det behövs.

### Nyckelintressenter

| Namn | Roll |
|------|------|
| Martin Lindqvist | CIO – sponsrar go-live-beslutet |
| Anna Berg | IT Ops Lead – driftansvarig post go-live |
| Karl Eek | Dev Lead – ansvarig för plattform och integration |
| Erik Holm | CFO – godkänner kostnadsbild och ROI |
| Lina Nordin | Head of HR – påverkas av onboarding-flöden |

---

## Mål: Go-Live Readiness Package för CAB-beslut

Paketet ska besvara tre frågor inför CAB:
1. **Är tjänsten redo att gå live?** (Operational Readiness)
2. **Vad händer om något går fel?** (RFC, rollback, incident)
3. **Hur mäter vi framgång?** (SLO:er och CI-register)

---

## Snabb arbetsgång

```
1. Service Snapshot     → Vad är tjänsten? Vem använder den?
2. SLO:er               → Hur mäter vi att den fungerar?
3. Operational Readiness → Hur driftsätts och hanteras den?
4. Change & Release     → RFC och go-live-plan
5. Reflection           → Vad lärde vi oss?
```

---

## Dokumentstruktur

### Kärnunderlag

| Fil | Beskrivning |
|-----|-------------|
| [docs/00-executive-summary.md](docs/00-executive-summary.md) | Beslutsorienterad sammanfattning för CIO/CAB |
| [docs/01-service-snapshot.md](docs/01-service-snapshot.md) | Tjänstedefinition och intressentöversikt |
| [docs/02-service-levels-slo.md](docs/02-service-levels-slo.md) | SLO-tabell och go/no-go-kriterier |
| [docs/03-operational-readiness.md](docs/03-operational-readiness.md) | Driftmodell, incidenthantering och eskalering |
| [docs/04-change-release-rfc.md](docs/04-change-release-rfc.md) | RFC för go-live med rollback och hypercare |
| [docs/05-reflection.md](docs/05-reflection.md) | Gruppreflektion och lärdomar |

### Register och kartor

| Fil | Beskrivning |
|-----|-------------|
| [docs/risk-register.md](docs/risk-register.md) | Riskregister med åtgärder och ägare |
| [docs/ci-register.md](docs/ci-register.md) | Continual Improvement-register |
| [docs/stakeholder-map.md](docs/stakeholder-map.md) | Intressentkarta med behov och hantering |
| [docs/cab-presentation-outline.md](docs/cab-presentation-outline.md) | Presentationsstruktur för CAB-mötet |

### Mallar

| Fil | Beskrivning |
|-----|-------------|
| [templates/slo-template.md](templates/slo-template.md) | Mall för att definiera SLO:er |
| [templates/rfc-template.md](templates/rfc-template.md) | RFC-mall |
| [templates/incident-playbook-template.md](templates/incident-playbook-template.md) | Incidentspelbok |
| [templates/rollback-plan-template.md](templates/rollback-plan-template.md) | Rollback-plan |
| [templates/decision-log-template.md](templates/decision-log-template.md) | Beslutslogg |

### Diagram (Mermaid)

| Fil | Beskrivning |
|-----|-------------|
| [diagrams/service-flow.mmd](diagrams/service-flow.mmd) | Tjänsteflöde från medarbetare till lösning |
| [diagrams/escalation-map.mmd](diagrams/escalation-map.mmd) | Eskaleringskarta |
| [diagrams/go-live-readiness-flow.mmd](diagrams/go-live-readiness-flow.mmd) | Vägen från snapshot till CAB-beslut |

---

> **Antagande:** Alla kostnadsuppgifter, SLA-värden och tidpunkter i detta repo är uppskattningar baserade på rimliga antaganden för en tjänst av NordIQs typ. Gruppen uppmanas att justera dessa värden baserat på tillgänglig information.

