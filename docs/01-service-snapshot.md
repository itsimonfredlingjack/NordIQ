# Service Snapshot v0 - NordIQ

> **Dokumenttyp:** Service Snapshot  
> **Ägare:** Studentteamet som IT-PM, med Anna Berg som primär driftmottagare  
> **Version:** v0  
> **Status:** Första arbetsversion baserad på skolmaterialet

---

## 1. Service Definition

> **NordIQ är ett sätt att möjliggöra för NordTechs medarbetare att få återkommande IT-supportärenden triagerade och besvarade eller eskalerade, utan att själva behöva känna till rätt supportväg, vänta på manuell first line för FAQ-ärenden eller bära komplexiteten i bakomliggande AI-, drift- och leverantörskedja.**

Det här beskriver NordIQ som en tjänst, inte som en teknikstack. Tjänsten ska skapa nytta genom att ta bort väntetid, osäker supportväg och repetitiv first-line-belastning, samtidigt som ärenden som kräver människa inte får fastna hos agenten.

### Källfakta från caset

| Område | Uppgift |
|--------|---------|
| Organisation | NordTech AB, cirka 450 medarbetare |
| Nuvarande first-line-belastning | cirka 70 ärenden/dag |
| Nuvarande first-line-bemanning | 4 personer |
| Nuvarande genomsnittlig resolution | 2,5 dagar |
| Återkommande/FAQ-klassade ärenden | cirka 40 % |
| NordIQ-målbild | 40-60 % first-line deflection |
| Serviceidé | 24/7 first-line-stöd utan skift, helgköer eller måndag morgon-kö |
| Leverantörskedja | CloudFrame Nordic som hostingplattform; Lumeon API som LLM API för agentlagret |

### Arbetsantaganden

- Teams, mejl och webbportal används som exempel på möjliga kanaler eftersom skolmaterialet nämner dessa som ingångar i tjänsteflödet.
- `Befintligt ärendehanteringssystem` används när dokumenten behöver beskriva ticket-/routing-flöde, eftersom skolmaterialet inte namnger ett specifikt system.
- Exakta SLO-trösklar, testmiljöer, monitoring och säkerhetskontroller behöver verifieras innan CAB.

---

## 2. Consumers & Stakeholders

| Aktör | Typ | Vad de vill få ut | Viktig spänning/risk |
|-------|-----|-------------------|----------------------|
| Medarbetare på NordTech (~450) | Primär konsument | Snabb hjälp med vanliga IT-frågor utan att veta rätt supportväg. | Fel svar eller krånglig eskalering kan göra att de går runt tjänsten. |
| First line support (4 personer) | Påverkad intern grupp | Färre repetitiva FAQ-ärenden och bättre strukturerade eskaleringar. | Rollen förändras; dåliga eskaleringar kan göra arbetet tyngre. |
| Second line / specialistgrupper | Intern leveransgrupp | Kompletta ärenden med kategori, prioritet och kontext. | Felklassificering eller tunt underlag skapar merarbete. |
| Anna Berg | IT Ops Lead / driftmottagare | Tydligt runbook-, SLO- och eskaleringsansvar före go-live. | Ärver tjänsten post go-live och behöver kunna stoppa eller eskalera vid problem. |
| Karl Eek | Internal Dev Lead | Få AI Agent Platform produktionssatt som flaggskeppscase. | Riskerar att driva fortare än driftövertagandet tål. |
| Martin Lindqvist | CIO / beslutsägare | Board-ready story, kontrollerad risk och tydligt go/no-go-underlag. | Bär den politiska risken om NordIQ misslyckas internt. |
| Erik Holm | CFO / leverantörs- och kostnadsägare | Förutsägbar run-rate, tokenkostnad och leverantörsrisk. | Äger CloudFrame/Lumeon-kontrakten men studentteamet har inget budgetmandat. |
| Lina Nordin | Head of HR / tung intern användare | Nyanställda ska inte vänta flera dagar på återkommande IT-stöd. | HR-onboarding blir synligt drabbat om agenten ger fel eller försenar ärenden. |
| CloudFrame Nordic | Extern leverantör | Stabil hostingplattform för AI Agent Platform. | Om hostingplattformen är nere är NordIQ nere. |
| Lumeon API | Extern leverantör | LLM API för agentlagret. | Om LLM API:t är nere eller instabilt påverkas agentens svarsförmåga och tokenkostnad. |
| Befintligt ärendehanteringssystem | Intern/extern systemberoende, ej namngivet i skolmaterialet | Registrera, routa och följa upp ärenden som inte löses direkt. | Om flödet inte fungerar blir eskalering och uppföljning svag. |

---

## 3. Value Statement

### Nytta

| För vem | Värde |
|---------|-------|
| Medarbetare | Kortare väntan, dygnet-runt-ingång och mindre behov av att förstå intern IT-organisation. |
| First line | Mindre tryck från återkommande FAQ-ärenden, vilket frigör tid till ärenden som kräver mänskligt omdöme. |
| Second line | Bättre strukturerade ärenden när eskalering behövs. |
| Anna Berg / IT Ops | Mätbar tjänst med SLO:er, eskaleringsvägar och förbättringsdata. |
| Martin Lindqvist / CIO | Ett kontrollerat go-live-underlag i stället för ett rent teknikdemo-beslut. |
| Erik Holm / CFO | Bättre synlighet i kostnad och leverantörsberoenden innan run-rate godkänns. |
| Lina Nordin / HR | Potentiellt snabbare hantering av repetitiva onboardingfrågor. |

### Nya kostnader och risker

| Typ | Risk/kostnad |
|-----|--------------|
| Kostnad flyttas | Manuell first-line-tid minskar potentiellt, men LLM-tokenkostnad och agentunderhåll tillkommer. |
| Risk flyttas | Mänsklig kö och variation ersätts delvis av AI-klassificering, kunskapsbasberoende och icke-deterministiska svar. |
| Leverantörsberoende | CloudFrame och Lumeon API blir kritiska delar av tjänstens warranty. |
| Driftansvar | Anna Berg behöver runbooks, eskaleringsregler och mandat för rollback innan hon kan ta över tryggt. |
| Förtroende | Enstaka felaktiga svar kan sänka adoptionen även om mätvärdena ser bra ut. |

---

## 4. Utility vs Warranty

### Utility - vad NordIQ ska göra

- Ta emot vanliga IT-supportfrågor via definierade kanaler.
- Triagera om frågan är FAQ, service request, incident, fråga/klagomål eller möjlig change.
- Besvara återkommande/FAQ-klassade frågor när kunskapsunderlaget räcker.
- Skapa strukturerad eskalering i befintligt ärendehanteringssystem när människa behövs.
- Eskalera P1/P2 och känsliga ärenden till människa i stället för att försöka lösa dem själv.
- Ge data om återkommande frågor, kunskapsluckor och felklassificeringar till Continual Improvement.

### Warranty - vad som måste vara tillräckligt tillförlitligt

| Område | Första warranty-bild |
|--------|----------------------|
| Tillgänglighet | Tjänsten marknadsförs som 24/7, men faktisk tillgänglighetsnivå måste sättas efter baseline och leverantörs-SLA. |
| Kapacitet | Tjänsten måste klara ungefär 70 ärenden/dag och måndag morgon-toppar utan att skapa ny kö. |
| Svarstid | Första svar behöver vara snabbt nog för att användare inte ska återgå till manuell first line. Exakt tröskel är ett SLO-antagande. |
| Säkerhet | P1/P2, personuppgifter och osäkra AI-svar ska eskaleras till människa. Kontroller behöver verifieras före go-live. |
| Kontinuitet | Fallback till manuell first line och befintligt ärendehanteringssystem måste vara dokumenterad. |
| Spårbarhet | Ärenden och eskaleringar behöver kunna följas upp, men exakt loggkälla är inte etablerad i skolmaterialet. |

### Warranty-risker

- CloudFrame-avbrott påverkar hostingplattformen för AI Agent Platform.
- Lumeon API-avbrott påverkar LLM/agentlagrets svarsförmåga.
- Kunskapsbasen kan bli inaktuell och ge fel svar.
- Felklassificering kan skicka incidenter eller service requests fel väg.
- SLO:er utan baseline riskerar att bli gissningar.

---

## 5. Four Dimensions

| Dimension | Vad NordIQ har vid go-live | Current situation today |
|-----------|----------------------------|-------------------------|
| **Organizations & People** | Anna Berg behöver ta emot driftansvar; Karl Eek äger plattformen; first line och second line får ändrade arbetsflöden; CIO/CAB behöver beslutspunkter. | Cost-center IT med cirka 25 personer, 4 personer i first line, ingen formaliserad CAB och inga dokumenterade SLO:er. |
| **Information & Technology** | AI Agent Platform, kunskapsbas, agentlogik, befintligt ärendehanteringssystem och mätpunkter för SLO:er måste fungera ihop. | Karl har plattformen byggd, men kvalitet på kunskapsbas, baseline, säkerhetskontroller och mätning behöver verifieras. |
| **Partners & Suppliers** | CloudFrame Nordic hostar AI Agent Platform; Lumeon API levererar LLM API för agentlagret; Erik Holm äger leverantörskontrakten. | CloudFrame är etablerad leverantör med testad SLA enligt caset; Lumeon är nyare, cirka 10 månader, med SLA endast ytligt testad. Om någon av dem är nere är NordIQ nere eller kraftigt degraderad. |
| **Value Streams & Processes** | Flödet måste gå från medarbetarfråga till direkt svar eller strukturerad eskalering, med feedback tillbaka till kunskapsbas och CI-register. | Nuvarande first line är överbelastad; request/incident/problem/CI-processer behöver dokumenteras som go-live-förutsättningar snarare än antas vara mogna. |
