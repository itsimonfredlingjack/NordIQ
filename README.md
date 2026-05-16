# NordIQ - Go-Live Readiness Package

> **Skoluppgift | ITIL | CAB-underlag**  
> Kurs: IT-tjänstehantering | Grupp: [Gruppnamn]

---

## Vad är det här repot?

Det här repot innehåller ett **Go-Live Readiness Package** för tjänsten **NordIQ** - en AI-stödd intern service desk hos det fiktiva bolaget **NordTech AB**.

Paketet är tänkt som beslutsunderlag inför ett CAB-möte (Change Advisory Board) och riktar sig primärt till CIO Martin Lindqvist och övriga beslutsfattare. Dokumenten är arbetsutkast: värden som inte uttryckligen kommer från skolmaterialet ska behandlas som antaganden eller go/no-go-kriterier tills de verifieras.

---

## Case: NordTech AB & NordIQ

**NordTech AB** är ett medelstort svenskt IT-konsultbolag med cirka 450 medarbetare, Göteborg som huvudkontor och kontor även i Stockholm och Malmö. Den interna IT-organisationen är cost-center IT med cirka 25 personer, ingen formaliserad CAB och inga dokumenterade SLO:er.

**NordIQ** är den tjänst som ska sjösättas: en AI-stödd intern service desk som ska triagera och svara på återkommande first-line-ärenden, samt eskalera ärenden som behöver mänsklig hantering via befintligt ärendehanteringssystem.

Källmaterialets basdata:

| Område | Uppgift |
|--------|---------|
| Medarbetare | cirka 450 |
| First-line-belastning | cirka 70 ärenden per dag |
| First-line-bemanning | 4 personer |
| Genomsnittlig resolution idag | 2,5 dagar |
| Återkommande/FAQ-klassade ärenden | cirka 40 % |
| NordIQ-målbild | 40-60 % first-line deflection |
| Tillgänglighetsidé | 24/7, utan skift och helgköer |
| Leverantörer | CloudFrame Nordic = hostingplattform för AI Agent Platform; Lumeon API = LLM API för agentlagret |

### Nyckelintressenter

| Namn | Roll |
|------|------|
| Martin Lindqvist | CIO - beställare och go-live-beslutsägare |
| Anna Berg | IT Ops Lead - tar över driftansvar post go-live |
| Karl Eek | Internal Dev Lead - ansvarig för AI Agent Platform |
| Erik Holm | CFO - äger leverantörsavtal och kostnadsfrågor |
| Lina Nordin | Head of HR - tung användare av first-line support vid onboarding |

---

## Mål: Go-Live Readiness Package för CAB-beslut

Paketet ska besvara tre frågor inför CAB:
1. **Är tjänsten redo att gå live?** (Operational Readiness)
2. **Vad händer om något går fel?** (RFC, rollback, incident)
3. **Hur mäter vi framgång?** (SLO:er och CI-register)

---

## Snabb arbetsgång

```text
1. Service Snapshot      -> Vad är tjänsten? Vem använder den?
2. SLO:er                -> Hur mäter vi att den fungerar?
3. Operational Readiness -> Hur driftsätts och hanteras den?
4. Change & Release      -> RFC och go-live-plan
5. Reflection            -> Vad lärde vi oss?
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

### App-mockup

| Mapp | Beskrivning |
|------|-------------|
| [app/](app/) | Live NordIQ-mockup mot lokal Ollama (`nordiq:2` på `gemma4:e2b`). Default-vy är Shadow Replay (CAB-facing) — 12 representativa first-line-ärenden klassificeras live, med cluster-detection för multi-user-incidenter. "Open employee view" visar Lina-onboarding-flödet (KB-RAG, vision, IT-intake packet). Kör med `cd app && npm install && npm run dev`. |

---

> **Antagande:** Tekniska detaljer som inte uttryckligen stöds av skolmaterialet, exempelvis kanalval, kunskapsbasverktyg, övervakning, testupplägg och exakta SLO-trösklar, är arbetsantaganden. De ska verifieras innan de används som beslutsunderlag i CAB.
