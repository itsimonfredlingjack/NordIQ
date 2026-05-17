# NordIQ — Go-Live Readiness Package

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

## What You Deliver

### Vad paketet innehåller

Ett **Go-Live Readiness Package** för NordIQ vid NordTech AB: den samling artefakter ett IT-PM-team skulle överlämna till CIO och CAB för att få sign-off inför produktion.

Paketet beskriver NordIQ i **service language**. Det betyder att tjänsten inte beskrivs som en teknikstack eller en chatbot, utan som en intern IT-tjänst med service consumers, service levels, incidenthantering, escalation, rollback och continual improvement.

Underlaget stödjer ett **conditional Go/No-Go decision**. Det betyder att dokumenten beskriver vad som behöver vara sant inför go-live, men de ska inte läsas som att produktion redan är godkänd eller att alla kontroller redan är verifierade.

| # | Artefakt | Beskrivning | Innehåll | Repo-fil |
|---|----------|-------------|----------|----------|
| 1 | **Cover & Snapshot** | Describes NordIQ in service language — not as a stack. | Service Definition, Stakeholder Map, Value · Utility · Warranty, Four Dimensions | [docs/1. Cover & Snapshot.md](<docs/1. Cover & Snapshot.md>) |
| 2 | **Service Levels** | Defines what "good enough" means before go-live. | Internal SLOs, rationale per target, how each is measured, Service Request Handling | [docs/2. Service Levels.md](<docs/2. Service Levels.md>) |
| 3 | **Operational Readiness** | How NordIQ runs day-to-day — and recovers when it breaks. | Major-Incident Playbook, Problem-Management Approach, Continual Improvement Register, On-call & Escalation Map | [docs/3. Operational Readiness.md](<docs/3. Operational Readiness.md>) |
| 4 | **Change & Release** | The plan to take NordIQ into production — and back out. | RFC for go-live, CAB Design, Go/No-Go Criteria, Rollback Plan | [docs/4. Change & Release.md](<docs/4. Change & Release.md>) |

**CIO** = Chief Information Officer
**CAB** = Change Advisory Board, the body that approves or advises on go-lives.

### Mockup

[mockup/](mockup/) innehåller en klickbar single-screen-mockup av medarbetarytan för NordIQ.

Mockupen visar servicebeteende genom tre scripted scenarios:

- lösenordsåterställning som FAQ/deflection-exempel;
- onboarding av konsult som service request och strukturerad ticket/handoff;
- incidentliknande inloggningsproblem där agenten eskalerar till människa.

Mockupen är visuellt stöd för tjänsteflödet. Den är inte bevis på produktionsklar LLM-integration, SLO-uppföljning, CAB-godkännande eller driftberedskap.

```bash
cd mockup
npm install
npm run dev
npm run typecheck
```

### Verification Note

Värden som inte är direkt verifierade i skolmaterialet ska behandlas som **assumptions**, **targets**, **go/no-go criteria** eller **verification needs**.

Detta package ska därför inte påstå att go-live är approved. Det ska visa vad CAB behöver kunna bedöma innan NordIQ kan gå live.

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

## 1. Cover & Snapshot

Describes NordIQ in service language — not as a stack.

### Service Definition

NordIQ är en AI-stödd intern first-line supporttjänst för NordTech AB:s medarbetare. Tjänsten gör det möjligt för service consumers att få snabbare hjälp med vanliga IT-supportbehov utan att behöva vänta på manuell first-line-hantering eller förstå hur ärendet ska routas internt.

NordIQ tar emot supportförfrågningar, klassificerar dem, besvarar återkommande FAQ-liknande ärenden när Knowledge Base räcker och eskalerar ärenden som kräver mänsklig hantering till rätt supportflöde.

Tjänsten ska skapa värde genom kortare väntetid, lägre repetitiv first-line-belastning och mer strukturerade escalations. Den ersätter inte mänskligt ansvar för kritiska, osäkra eller känsliga ärenden.

### Stakeholders & Value Statements

Värdeflödet mellan tjänsten och dess intressenter sammanfattas i tabellen nedan: vilka risker som tas bort, vilka risker som introduceras, samt vilka kostnader som elimineras eller tillkommer.

#### Risker per roll

| Roll | Risk Removed | Risk Imposed | Cost Removed | Cost Imposed |
|------|--------------|--------------|--------------|--------------|
| **Lina, HR** | Kan onboarda nya medarbetare utan flaskhals hos IT. | AI-hallucinationer kan ge fel i onboardingen, till exempel fel access. | Tidseffektivt om tjänsten fungerar. | Dubbelarbete om NordIQ ger fel svar eller behöver korrigeras manuellt. |
| **Karl, Dev** | Mindre brandsläckning på enkla L1-ärenden och mer tid för plattformsutveckling. | Om agenten ger fel svar kopplas risken till plattformen han byggt. | Mindre manuell support för FAQ-klassade ärenden. | Äger kunskapsbas och agentbeteende som måste hållas uppdaterade kontinuerligt. |
| **Martin, CIO** | Politisk risk minskar om NordIQ levererar och kan visa Q4-besparingar till CEO. | Om NordIQ fallerar internt bär han ansvaret uppåt. | Lägre L1-personalkostnad på sikt om deflection håller. | Go-live-beslutet ligger hos honom; fel timing skadar trovärdighet och förtroende. |
| **Erik, CFO** | Förutsägbarare IT-kostnader om deflection och leverantörskostnad håller. | Lumeon API-kostnad kan skala okontrollerat vid hög volym. | Färre timmar fakturerade mot L1-support. | Ny löpande kostnad för tokens och hosting. |
| **Anna, Ops** | Slipper repetitiva ärenden som tar tid från komplexa problem. | Eskaleringsflödet beror på att agenten klassificerar rätt; fel klassificering skickar ärenden till fel resolver. | Lägre volym enkla tickets att hantera manuellt. | Äger driften av en tjänst hon inte byggde och måste kunna lita på efter go-live. |

### The Four Dimensions

#### 1. Organizations & People

NordIQ stödjer NordTechs medarbetare genom att erbjuda en snabbare first-line-ingång för återkommande IT-supportbehov. Lina Nordin, Head of HR, påverkas särskilt vid onboarding och åtkomstrelaterade frågor. Anna Berg, IT Ops Lead, hanterar eskalerade ärenden och behöver kunna ta över driftansvar efter go-live.

CIO Martin Lindqvist fokuserar på affärsvärde, risk och beslutspunkt. CFO Erik Holm fokuserar på kostnadskontroll, leverantörsberoenden och run-rate. Karl Eek, Internal Dev Lead, ansvarar för AI Agent Platform och tekniska begränsningar.

En viktig rollgräns är ägandeskapet av AI-agentens svar. När NordIQ besvarar ett ärende automatiskt behöver det vara tydligt när ansvaret ligger hos IT Ops, Dev Lead, processägare eller mänsklig resolver.

#### 2. Information & Technology

Tjänsten är byggd kring NordIQ:s AI-supportagent och stöds av Lumeon API som LLM-beroende, interna kunskapsdatabaser, FAQ-innehåll samt ticketing- och eskaleringssystem.

Svarskvaliteten är direkt beroende av att Knowledge Base hålls uppdaterad. En föråldrad kunskapsbas ger felaktiga svar oavsett hur väl övriga delar av tjänsten fungerar. Därför är Knowledge Base sync en central warranty-risk och kopplas till SLO:t om uppdatering inom 24 timmar vid kända förändringar.

#### 3. Partners & Suppliers

NordIQ är beroende av externa leverantörer. **CloudFrame Nordic** hostar AI Agent Platform och är därför kritisk för tjänstens availability. **Lumeon API** är LLM API för agentlagret och påverkar svarsförmåga, latens, kvalitet och tokenkostnad.

Leverantörerna är service constraints. NordTech kan inte lova högre intern service level än vad den egna driftkedjan, CloudFrame Nordic och Lumeon API faktiskt kan stödja.

#### 4. Value Streams & Processes

Value stream börjar när en medarbetare skickar in en IT-supportförfrågan. NordIQ ger direkt svar på återkommande och låg-risk-frågor, exempelvis lösenordsåterställning, onboardingstöd och åtkomstförfrågningar när Knowledge Base räcker.

Om problemet inte kan lösas automatiskt eskaleras ärendet till Anna Berg, IT Ops eller rätt resolver enligt definierat supportflöde. Eskalering inom två minuter är ett service target och behöver verifieras innan det används som CAB-evidence.

Value stream inkluderar även failover vid avbrott i AI-agenten. Då ska inkommande ärenden dirigeras till manuell first-line-hantering, SharePoint FAQ eller befintligt ärendehanteringssystem enligt rollback- och incidentrutin. Failover är alltså inte ett undantag från tjänsten, utan en planerad del av tjänstens continuity.

### Utility vs Warranty

#### Utility

- **Omedelbar självbetjäning:** Löser FAQ-ärenden dygnet runt utan väntetid när Knowledge Base och risknivå stödjer direktsvar.
- **Intelligent triage:** Sorterar och dirigerar ärenden som Incident, Service Request eller Change till rätt instans.
- **Datadrivna insikter:** Identifierar kunskapsluckor, återkommande fel och förbättringsbehov för Continual Improvement.

NordIQ skapar värde för NordTech genom att ge medarbetarna en mer tillgänglig intern supporttjänst. Tjänsten hanterar ärenden som FAQ-frågor, onboarding och lösenordshantering. Syftet är att service consumers inte ska behöva vänta på manuell first-line support när ärendet kan lösas säkert och korrekt genom tjänsten.

#### Warranty

- **Availability:** Tjänsten ska matcha ambitionen om 24/7-support, vilket kräver tillräcklig uptime från både CloudFrame Nordic, Lumeon API och den interna supportkedjan.
- **Continuity:** Robusta fallback-rutiner behövs vid avbrott i AI-plattformen, till exempel omdirigering till manuell hantering.
- **Korrekt information:** Knowledge Base måste hållas synkad så att AI-agenten ger korrekta, säkra och användbara svar.

NordIQ har målbilden att deflecta 40-60 % av first-line-flödet, med 60 % som övre stabiliseringsmål. Detta är ett target inför go-live och ska verifieras innan det används som beslutsbevis.

Centrala warranty-risker är felklassificering, felroutade ärenden, avbrott i AI-plattformen, avbrott eller latens i Lumeon API samt föråldrad Knowledge Base. Vid sådana avbrott ska händelsen hanteras som en Incident enligt Incident Management. Identifierade mönster och bakomliggande orsaker ska hanteras genom Problem Management och Continual Improvement.

---

## 2. Service Levels

Defines what "good enough" means before go-live.

### Internal SLOs (Service Level Objectives)

För varje SLO definierar NordTech ett SLI, alltså det mätvärde som kan samlas in från tjänsten eller supportflödet. SLO är target; SLI är hur NordTech mäter om target nås.

SLO:erna nedan är interna mål inför go-live. De ska inte beskrivas som uppnådda resultat förrän baseline och faktisk mätning finns.

| Vad mäts (SLI) | Internt mål (SLO) | Rationale |
|----------------|-------------------|-----------|
| AI-agentens svarstid per förfrågan | p95 ska få svar inom 5 sekunder. | Lina och övriga användare förväntar sig omedelbar hjälp. Lång svarstid driver användare tillbaka till manuell first line. |
| Tjänstens tillgänglighet (uptime) | 99,5 % per kalendermånad. | NordIQ har en 24/7-ambition. 99,5 % ger cirka 3,6 timmar tolererat avbrott per månad, men målet måste stämmas av mot leverantörernas faktiska SLA/UC. |
| Korrekt klassificering av ärenden | 90 % rätt kategoriserade som FAQ, Incident eller Request. | Felklassificering är en definierad warranty-risk. Målet är en go-live-tröskel och behöver verifieras i test eller pilot. |
| Tid till eskalering vid okänt ärende | Eskalering minst inom 2 minuter från inkommet ärende. | Om AI-agenten inte kan hantera ärendet ska det nå Anna/IT Ops innan användaren tappar förtroende eller kritiska ärenden fastnar. |
| Kunskapsbas-synk | Knowledge Base uppdaterad inom 24 timmar vid kända förändringar. | Föråldrad KB ger felaktiga svar och påverkar direkt warranty-kravet om korrekt information. |

### Service Request Handling

NordTech hanterar användares önskemål om hjälp, information eller tillgång till nya resurser genom NordIQ, IT Ops och eventuell eskalering.

1. **Submit** — Medarbetaren skickar in ärendet via Teams, e-post eller webbportal.
2. **Triage** — NordIQ klassificerar ärendet automatiskt som FAQ, Incident, Request eller Change.
3. **Fulfill** — AI-agenten har som target att deflecta 40-60 % av inkommande first-line-ärenden. Faktisk deflection måste verifieras.
4. **Eskalering** — Resterande eller osäkra ärenden skickas till Anna Berg, IT Ops eller rätt resolver inom två minuter enligt SLO 4.
5. **Verify and close** — Ärendet markeras som löst först när lösningen verifierats genom användarbekräftelse, automatiserad kontroll eller relevant resolver.

#### OLA per steg

| Steg | Rubrik | OLA |
|------|--------|-----|
| 1 | Förfrågan skickas in | Registreras direkt. |
| 2 | Ärendet klassificeras | Klassificering inom 2 sekunder. |
| 3 | Första svar ges | Första AI-svar p95 < 5 sekunder. |
| 4 | Eskalering vid behov | Ticket/eskalering skapas inom 2 minuter. |
| 5 | IT Ops hanterar | Hantering påbörjas enligt prioritet, till exempel SEV1 inom 15 minuter och SEV2 inom 60 minuter. |
| 6 | Stängning & lärande | Knowledge Base uppdateras inom 24 timmar vid känd förändring eller återkommande fel. |

#### Detaljerat flöde

| Steg | Namn | Vad som händer hos NordTech |
|------|------|-----------------------------|
| 1 | Submit | Medarbetaren skickar in ärendet via Teams, e-post eller webbportal. Ärendet registreras direkt. |
| 2 | Triage | NordIQ klassificerar ärendet automatiskt som FAQ, Service Request, Incident eller Change. Klassificering sker inom 2 sekunder. |
| 3 | Approve | Om ärendet kräver godkännande skickas det till rätt godkännare, till exempel chef, budgetägare, security eller dataägare. För fördefinierade låg-risk-ärenden kan godkännandet vara förhandsgodkänt. |
| 4 | Assign | Ärendet routas till rätt fulfiller: AI-agent, IT Ops, Incident Management, Change Enablement, Dev eller extern leverantör. Ärenden som AI-agenten inte kan hantera assignas vidare inom två minuter enligt SLO 4. |
| 5 | Fulfill | AI-agenten har som målbild att deflecta 40-60 % av inkommande first-line-ärenden. Övriga ärenden hanteras av rätt resolver enligt prioritet. Om ärendet är en incident används SEV-nivåer, till exempel SEV1 inom 15 minuter och SEV2 inom 60 minuter. |
| 6 | Verify | Lösningen verifieras genom användarbekräftelse, automatiserad kontroll eller resolver-bekräftelse. |
| 7 | Close | Ärendet stängs. Om ärendet visar en kunskapslucka eller återkommande fel uppdateras Knowledge Base inom 24 timmar och förbättringen loggas i Continual Improvement Register vid behov. |

---

## 3. Operational Readiness

How NordIQ runs day-to-day — and recovers when it breaks.

### Major-Incident Playbook

Handlingsplan och krismanual för NordTechs hantering om NordIQ drabbas av ett allvarligt driftproblem efter go-live. En Incident är en oplanerad händelse som orsakar eller riskerar att orsaka avbrott i tjänsten eller supportflödet.

#### Stora incidenter som kan inträffa

- NordIQ ligger nere.
- Lumeon API svarar inte.
- AI-agenten felklassar många ärenden.
- Användare får felaktiga eller osäkra svar.
- Eskalering till IT Ops fungerar inte.

| Steg | Aktivitet | Ansvarig |
|------|-----------|----------|
| Identifiering | Larm från övervakning eller rapport från verksamheten, exempelvis HR, om att NordIQ ger felaktiga svar eller inte fungerar enligt förväntat supportflöde. | IT Ops / Anna Berg |
| Triage och deklaration | Bedöm om påverkan är bred, kritisk eller säkerhetsrelaterad. Om ja, deklarera Major Incident. | Incident Commander |
| Isolering / failover | Avgör om AI-chatten ska stängas av helt eller om Emergency Redirect till tidigare supportväg ska aktiveras. | Technical Lead / Karl Eek |
| Leverantörskontakt | Kontrollera status hos CloudFrame Nordic och Lumeon API. Öppna supplier tickets när leverantörsberoende misstänks. | Supplier Contact / IT-PM |
| Upplösning | Verifiera att tjänsten fungerar normalt igen efter fix, workaround eller rollback. | Technical Lead / Karl Eek |
| Kommunikationsstopp | Informera organisationen om all-clear och eventuell kvarstående workaround. | Communications Lead / Lina Nordin |

### Problem-Management Approach

#### 5 Whys

RCA-tillvägagångssätt för återkommande fel i NordIQ. För enkla, avgränsade problem används **5 Whys**, en iterativ Root Cause Analysis som identifierar varför ett fel inträffat genom att stegvis fråga "Why?" tills bakomliggande orsak blir tydlig.

#### Contributing Factors

För mer komplexa incidenter används **Contributing Factors**, eftersom fel kan bero på en kombination av AI-agenten, Knowledge Base, routing, människor och leverantörer.

Contributing Factors används för att identifiera systemförhållanden, tekniska tillstånd och händelser som ökade sannolikheten för incidenten, även när de inte är den enda root cause.

### Communication Plan (Internt)

Kommunikationsplanen för incidenter i NordIQ följer **Incident Ladder**: först sker intern triage, därefter riktas meddelanden till berörda användare och endast vid bred påverkan till alla användare.

Kommunikation sker på **Fast Cadence**. Communications Lead ansvarar för uppdateringar så att Incident Commander kan fokusera på koordinering.

CIO Martin Lindqvist får 30-minutersstatus vid större incidenter. CFO Erik Holm kopplas in när leverantörsberoende, kostnad eller avtalsmässiga konsekvenser kan vara relevanta, särskilt gällande CloudFrame Nordic eller Lumeon API.

| Målgrupp | När informeras de? | Vad behöver de veta? | Kanal / cadence |
|----------|--------------------|----------------------|-----------------|
| Anna / Ops + Karl / Dev | Direkt efter triage. | Severity, påverkan, teknisk hypotes, vem som är Incident Commander och SME. | War room / Teams, löpande. |
| Martin, CIO | Vid SEV1 eller större verksamhetspåverkan. | Status, risk, beslutspunkter och nästa update. | Var 30:e minut tills stabilt. |
| Anställda / affected users | När användare påverkas. | Kort störningsinfo, workaround och när nästa besked kommer. | Teams/mail, vid start och all-clear. |
| Alla användare | Endast vid bred påverkan. | Kort störningsinfo, workaround och nästa uppdateringstid. | Teams broadcast / intranät. |
| Erik, CFO | Om leverantör kan vara orsak eller kostnad påverkas. | Om CloudFrame/Lumeon verkar orsaka avbrottet, bevisläge och potentiell avtals- eller kostnadspåverkan. | Direkt ping + incidentrapport. |
| CloudFrame / Lumeon | Om deras komponent misstänks. | Tekniska symptom, tidslinje, SLA/UC-fråga och begärd åtgärd. | Supplier ticket + eskalering. |

### Post-Incident Review (PIR)

Efter en SEV1- eller SEV2-incident genomför NordTech en **Post-Incident Review** för att förstå vad som hände, varför det hände och vilka förbättringar som krävs. Syftet är att förbättra NordIQ som tjänst.

- Vad hände?
- Varför hände det? Root cause.
- Hur ser vi till att det inte händer igen? Input till Problem Management.

### Continual Improvement Register

**Continual Improvement Register** behövs för att förbättringsförslag inte ska gå förlorade. Registret skapar ägarskap, prioritering och spårbarhet för förbättringar som kommer från incidenter, SLO-avvikelser, användarfeedback och kunskapsluckor.

Utöver registret ska det finnas en plan för hur ofta förbättringar granskas, hur resultat följs upp och hur genomförda förbättringar verifieras.

Begreppet skrivs ut som **Continual Improvement Register** för att inte blandas ihop med **Configuration Item (CI)**.

### On-call & Escalation Map

On-call & Escalation Map tydliggör vem som är ansvarig vid Severity 1- och Severity 2-incidenter. Om ansvarig person inte kan hantera incidenten ska det finnas en tydlig escalation path till nästa roll, resolver group eller supplier contact.

I on-call-schemat ska det anges vem som är first point of contact och vem som kontaktas om personen inte är tillgänglig. Det ska också finnas handover-protokoll så att information kan överföras mellan roller eller skift.

Följande roller är viktiga:

| Roll | Funktion |
|------|----------|
| First Point of Contact | Tar emot incidenten och startar responsflödet. |
| Incident Commander | Leder incidenten och håller ihop beslut, prioritering och cadence. |
| Technical Lead | Driver teknisk isolering, failover och återställning. |
| Communications Lead | Ansvarar för intern kommunikation och all-clear. |
| Supplier Contact | Eskalerar till CloudFrame Nordic eller Lumeon API vid leverantörsberoende. |

Rollerna ska samlas i ett digitalt eller fysiskt **war room** inom 15 minuter vid Major Incident. När en handlingsplan tagits fram ska alla uppdatera Incident Commander var 30:e minut tills problemet är löst eller tjänsten är i kontrollerad workaround/rollback.

### Principer för NordIQ

- **Blameless RCA** — utredningen frågar vilka systemförhållanden som tillät felet, inte vem som begick det.
- **Kopplade incidents är obligatoriska** — ett problem-ticket utan länkade incidents saknar faktaunderlag och hanteras inte som fullständig root-cause-utredning.
- **Workarounds har ett bäst-före-datum** — failover-läget, till exempel omdirigering till SharePoint och manuell ticket, är en tillfällig lösning. Om det aktiveras fler än två gånger på 30 dagar öppnas ett problem-ticket för permanent åtgärd.

---

## 4. Change & Release

The plan to take NordIQ into production — and back out.

### CAB Design

#### Change Authority

**Martin Lindqvist (CIO)** ansvarar för go-live-beslutet och äger den övergripande verksamhets- och ledningsrisken.

Martin Lindqvist är formell **Change Authority** för NordIQ go-live. Han äger det slutliga Go/No-Go-beslutet eftersom förändringen påverkar hela NordTechs interna supportmodell. CAB:s roll är att ge Martin ett tillräckligt komplett beslutsunderlag, inte att ersätta hans ansvar.

#### Change Advisory Board

| Roll | CAB-perspektiv |
|------|----------------|
| **Anna Berg (IT Ops Lead)** | Ärver NordIQ efter go-live och behöver kunna lita på att tjänsten är driftbar. Fokus: Incident Management, escalations, second-line-belastning och supportability. |
| **Karl Eek (Internal Dev Lead)** | Förklarar plattformens begränsningar, AI-agentens beteende, integrationsrisker, tekniska beroenden och hur snabbt teamet kan åtgärda fel efter go-live. |
| **Erik Holm (CFO)** | Äger leverantörsavtal med CloudFrame Nordic och Lumeon API samt följer kostnadsutveckling. Fokus: supplier risk, tokenkostnad och run-rate. |
| **Lina Nordin (Head of HR)** | Representerar användarperspektivet, särskilt onboarding, åtkomstfrågor och medarbetarrelaterade IT-behov. Hennes feedback är viktig för UAT, adoption och Continual Improvement. |

### Go / No-Go Criteria

Förbestämda tester och governance-kriterier måste vara verifierade eller uttryckligen riskaccepterade innan NordIQ kan gå live. Kriterierna nedan är go/no-go-villkor, inte bevis på att go-live redan är godkänd.

- Kvarstående P2/P3-risker ska vara dokumenterade, ägda och accepterade av IT Ops.
- Mindre än fem procent av testprompts får returnera felmeddelande.
- Health checks ska vara gröna under 24 sammanhängande timmar.
- Formellt CAB-beslut eller dokumenterad riskacceptans ska finnas innan faktisk go-live.
- Acceptanskriterier och normalflödestester ska vara godkända i kvalitetssäkrad miljö.

### Request for Change (RFC)

#### 1. Purpose

Syftet med RFC:n är att få ett formellt beslut om huruvida NordIQ kan lanseras som AI-stödd first-line supporttjänst. Förändringen ska minska väntetider, avlasta manuell support och ge medarbetare snabbare hjälp med vanliga IT-ärenden.

#### 2. Scope

RFC:n omfattar lansering av NordIQ för interna medarbetare på NordTech. Den inkluderar AI-agenten, Knowledge Base, klassificering av ärenden, escalation flow, fallback-lösning och koppling till befintligt ärendehanteringssystem.

#### 3. Technical Change Description

NordIQ införs som en AI-stödd supportkanal som kan ta emot, klassificera och besvara vanliga IT-supportfrågor. Tjänsten använder Lumeon API för AI-svar, CloudFrame Nordic för drift/hosting och befintliga system för eskalering och ticketing.

#### 4. Risk Assessment

De största riskerna är felaktiga AI-svar, felklassificering av ärenden, avbrott hos Lumeon API eller CloudFrame Nordic, föråldrad Knowledge Base och att eskalering till IT Ops inte fungerar. Riskerna hanteras genom SLO/SLI, monitoring, fallback, Major-Incident Playbook och rollback-plan.

#### 5. Rollback Plan

Om NordIQ inte fungerar efter go-live ska tjänsten kunna pausas och supportflödet återgå till tidigare arbetssätt. Användare kan då hänvisas till SharePoint FAQ och befintligt ticketing-system, medan manuell first-line support aktiveras vid behov.

Rollback är ett go-live-villkor och behöver verifieras innan planen används som CAB-evidence.

#### 6. Timeline and Window

Go-live bör ske under en kontrollerad tidsperiod med låg belastning, exempelvis under arbetstid när IT Ops, Karl Eek och relevanta leverantörskontakter är tillgängliga. Efter lansering följs tjänsten extra noga under en hypercare-period.

#### 7. Communication Plan

Berörda medarbetare informeras innan go-live om vad NordIQ är, hur tjänsten används och hur ärenden eskaleras. Vid problem kommunicerar IT Ops status enligt incidentplanen, med uppdateringar till användare och relevanta stakeholders.

#### 8. Approver List

Go-live bör godkännas av Martin Lindqvist som CIO och Change Authority, med input från Anna Berg för drift, Karl Eek för teknik, Erik Holm för leverantörs- och kostnadsrisker samt Lina Nordin för användarperspektivet.

### Change Enablement — Rollback Plan

#### Trigger

- NordIQ ger ingen respons på mer än 10 % av inkommande requests.
- Lumeon API är otillgänglig i mer än 30 minuter.
- AI-agentens felklassificeringsgrad överstiger accepterad nivå.
- Eskalering till IT Ops slutar fungera.

#### Rollback Steps

1. Martin Lindqvist, som Change Authority, godkänner beslut om rollback eller bekräftar tidigare delegerat rollback-mandat.
2. NordIQ tas offline eller agentförmågan pausas i berörda kanaler.
3. Inkommande ärenden omdirigeras till SharePoint FAQ och befintligt ärendehanteringssystem utan AI-hantering.
4. Anna Berg och IT-teamet återtar full manuell first-line-hantering.
5. Lina Nordin, HR och berörda medarbetare meddelas via beslutad kommunikationskanal.

#### What Stays, What Restores

| Område | Hantering |
|--------|-----------|
| AI Agent Platform | Förblir driftsatt men inaktiv eller begränsad, beroende på rollback-trigger. |
| Ärendehistorik | Ska bevaras enligt beslutad rollback-rutin. Detta behöver verifieras innan go-live. |
| CloudFrame Nordic och Lumeon API | Avtal och leverantörsberoenden kvarstår, men Lumeon-anrop kan stoppas eller begränsas under rollback. |
| Supportflöde | Manuell first-line-hantering och befintligt ticketing-system återställs som primär supportväg. |
