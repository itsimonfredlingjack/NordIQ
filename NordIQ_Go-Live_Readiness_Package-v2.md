

**A S S I G N M E N T   ·   I P L 2 5**

**GO-LIVE READINESS**

**PACKAGE**

**\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_**

*NordIQ — AI-stödd First-Line Support*

**NordTech AB**

| P R E P A R E D   B Y Simon Fredling Jack Jonas Öhrn Emma Hörnberg Annika Mellgren Filippa Skauby Killick *Maj 2026* |
| ----- |

**W H A T   W  E   D E L I V E R**

Ett **Go-Live Readiness Package** för NordIQ vid NordTech AB — den samling artefakter ett IT-PM-team skulle överlämna till en CIO och CAB för att få sign-off inför produktion.

| 1 COVER & SNAPSHOT Describes NordIQ in service language — not as a stack. A R T I F A C T ▸  Service definition ▸  Stakeholder map ▸  Value · utility · warranty ▸  Four dimensions | 2 SERVICE LEVELS Defines what “good enough” means before go-live. A R T I F A C T ▸  Internal SLOs ▸  Rationale per target ▸  How each is measured ▸  Service request handling |
| :---- | :---- |
| **3** **OPERATIONAL READINESS** How NordIQ runs day-to-day — and recovers when it breaks. **A R T I F A C T** **▸**  Major-incident playbook **▸**  Problem-management approach **▸**  Continual Improvement register **▸**  On-call & escalation map | **4** **CHANGE & RELEASE** The plan to take NordIQ into production — and back out. **A R T I F A C T** **▸**  RFC for go-live **▸**  CAB design **▸**  Go/no-go criteria **▸**  Rollback plan |

**CIO** *\= Chief Information Officer   ·*   **CAB** *\= Change Advisory Board (the body that approves go-lives)*

# **1\.  Cover & Snapshot**

*Describes NordIQ in service language — not as a stack.*

## **Service Definition**

NordIQ är en tjänst som gör det möjligt för NordTechs medarbetare att få snabbare hjälp med vanliga IT-supportbehov, utan att behöva vänta på manuell first-line-hantering eller förstå vart ärendet ska routas.

## **Stakeholders & Value Statements**

Värdeflödet mellan tjänsten och dess intressenter sammanfattas i tabellen nedan: vilka risker som tas bort, vilka som introduceras, samt kostnader som elimineras eller tillkommer.

### **Risker per roll**

| Roll | Risk Removed | Risk Imposed | Cost Removed | Cost Imposed |
| :---- | :---- | :---- | :---- | :---- |
| Lina, HR | Kan onboarda nya medarbetare utan flaskhals hos IT | AI-hallucinationer kan ge upphov till fel i onboardingen, t.ex. fel access | Tidseffektivt om det fungerar | Dubbelarbete om det inte fungerar. Kan t.ex. behöva utfärda change requests vid fel |
| Karl, Dev | Mindre brandsläckning på enkla L1-ärenden — mer tid för plattformsutveckling | Om agenten ger fel svar pekar fingret mot plattformen han byggt | Slipper manuell support för FAQ-klass ärenden | Äger kunskapsbasen — måste hållas uppdaterad kontinuerligt |
| Martin, CIO | Politisk risk minskar om NordIQ levererar — kan visa Q4-besparingar till CEO | Om NordIQ fallerar offentligt bär han ansvaret uppåt | Lägre L1-personalkostnad på sikt | Go-live-beslut är hans — fel timing skadar hans trovärdighet |
| Erik, CFO | Förutsägbarare IT-kostnader om deflection håller | Lumeon API-kostnad skalar okontrollerat vid hög volym | Färre timmar fakturerade mot L1-support | Ny löpande kostnad: tokens \+ hosting som inte funnits tidigare |
| Anna, Ops | Slipper ta emot repetitiva ärenden som tar tid från komplexa problem | Eskaleringsflödet beror på att agenten klassificerar rätt — gör den fel hamnar fel ärenden hos fel person | Lägre volym enkla tickets att hantera manuellt | Äger driften av något hon inte byggde och ännu inte litar på |

## **The Four Dimensions**

### **1\.  Organizations & People**

NordIQ stödjer NordTechs medarbetare genom att erbjuda omedelbar first-line IT-support. Lina (Head of HR) använder tjänsten ofta för onboarding och åtkomstrelaterade problem, medan Anna (IT Ops Lead) hanterar eskalerade ärenden och säkerställer tjänstens stabilitet. CIO Martin fokuserar på affärsvärde och minskad operativ risk, medan CFO Erik fokuserar på kostnadseffektivitet. En viktig rollgräns som måste definieras tydligt är ägandeskapet av AI-agentens svar. När NordIQ besvarar ett ärende automatiskt är det oklart om ansvaret faller på Anna (IT Ops) eller Karl (Dev Lead).

### **2\.  Information & Technology**

Tjänsten är byggd kring NordIQ:s AI-supportagent och stöds av Lumeon API (LLM), interna kunskapsdatabaser, vanliga frågor (FAQ) samt ticketing- och eskaleringssystemet. Svarskvaliteten är direkt beroende av att kunskapsbasen hålls uppdaterad: en föråldrad kunskapsbas ger felaktiga svar oavsett hur väl övriga delar av tjänsten fungerar. Det gör kunskapsbas-synkroniseringen till den dominerande riskfaktorn i den här dimensionen, och motiverar det definierade SLO:t om uppdatering inom 24 timmar.

### **3\.  Partners & Suppliers**

NordIQ är beroende av externa leverantörer som CloudFrame Nordic för drift och hosting, samt Lumeon API för AI-genererade supportsvar. Dessa leverantörer är kritiska för tjänstens tillgänglighet men skapar också beroenderisker och potentiella single points of failure.

### **4\.  Value Streams & Processes**

Value stream börjar när en medarbetare skickar in en IT-supportförfrågan. NordIQ ger ett direkt svar på vanliga problem som lösenordsåterställning, onboardingstöd och åtkomstförfrågningar. Om problemet inte kan lösas automatiskt eskaleras det till Anna och IT Ops-teamet inom två minuter. Value stream inkluderar även det definierade failover-flödet vid avbrott i AI-agenten, då ärenden automatiskt dirigeras till FAQ-sidor i SharePoint och tickets skapas manuellt. Det är inte ett undantag från value stream utan en planerad del av den, dokumenterad för att säkerställa kontinuitet även när normalflödet inte är tillgängligt.

## **Utility vs Warranty**

### **Utility**

* **Omedelbar självbetjäning:** Löser FAQ-ärenden dygnet runt utan väntetid.

* **Intelligent triage:** Sorterar och dirigerar ärenden (Incident, Request, Change) till rätt instans.

* **Datadrivna insikter:** Identifierar kunskapsluckor och återkommande problem för att driva ständiga förbättringar.

NordIQ skapar värde för NordTech genom att ge medarbetarna en tjänst som genererar mer tillgänglig IT-support. Tjänsten hanterar ärenden som FAQ-frågor, onboarding och frågor om lösenordshantering. Syftet är att användaren inte ska behöva vänta på manuell first-line support. Tjänsten ska klassificera ärenden i olika kategorier — exempelvis Incident, Service Request eller eventuell Change Request — för att sedan eskalera dessa till korrekt instans.

### **Warranty**

* **Availability:** Tjänsten ska matcha användarnas behov av 24/7-support, vilket kräver hög uptime från både CloudFrame och Lumeon.

* **Continuity:** Robusta fallback-rutiner vid avbrott i AI-plattformen (t.ex. automatisk omdirigering till manuell hantering).

* **Korrekt information:** Säkerställa att Knowledge Base alltid är synkad så att AI:n ger korrekta och säkra svar.

NordIQ ska kunna hantera 60 % av first-line-flödet med tillgänglighet dygnet runt. Warranty beskriver hur NordIQ säkerställer att tjänsten fungerar pålitligt, säkert och med rätt kvalitet — för att tjänsten ska kunna uppfylla sitt löfte om snabb support dygnet runt. Detta ställer krav på hög tillgänglighet från både CloudFrame Nordic och Lumeon API, samt att kunskapsbasen alltid är uppdaterad. Centrala risker för tjänsten är felklassificering av ärenden och att dessa dirigeras fel väg, vilket kan resultera i att ärenden inte fångas upp.

En annan central risk är avbrott i AI-plattformen eller API-kopplingen till Lumeon och Knowledge Base. Vid sådana avbrott ska händelsen klassificeras som en incident och hanteras enligt Incident Management. Backup ska fungera genom att NordIQ går in i ett failover-läge där inkommande ärenden automatiskt dirigeras till FAQ-sidor i SharePoint och tickets skapas i det befintliga ärendehanteringssystemet utan AI-hantering.

Identifierade risker hanteras vidare i Major-Incident Playbook, Incident Management och Problem Management.

# **2\.  Service Levels**

*Defines what “good enough” means before go-live.*

## **Internal SLOs (Service Level Objectives)**

För varje SLO definierar NordTech ett SLI — det vill säga den statistik som går att skapa utifrån systemet. SLO är vårt target; SLI definieras som på vilket sätt NordIQ uppnår SLO. I tabellen mäts SLI genom att samla in faktisk driftdata från tjänsten (t.ex. svarstid, tillgänglighet eller antal lösta ärenden) och jämföra den siffran mot målet i SLO.

| Vad mäts (SLI) | Internt mål (SLO) | Rationale |
| :---- | :---- | :---- |
| AI-agentens svarstid per förfrågan | p95 ska få svar inom 5 sekunder | Lina och övriga användare förväntar sig omedelbar hjälp. |
| Tjänstens tillgänglighet (uptime) | 99,5 % per kalendermånad | NordIQ marknadsförs som 24/7-stöd. 99,5 % ger \~3,6 h tolererat avbrott/månad. |
| Korrekt klassificering av ärenden | 90 % rätt kategoriserade (FAQ / Incident / Request) | Felklassificering är den definierade warranty-risken; 90 % är miniminivå för att fallback inte ska triggas för ofta. |
| Tid till eskalering vid okänt ärende | Eskalering minst inom 2 minuter från inkommet ärende | Om AI:n inte kan hantera ärendet ska det nå Anna/IT Ops innan användaren hunnit ge upp. |
| Kunskapsbas-synk | Uppdaterad Knowledge Base inom 24 h vid kända förändringar | Föråldrad KB ger felaktiga svar — direkt koppling till warranty-kravet om korrekt information. |

## **Service Request Handling**

NordTech hanterar användares önskemål om hjälp, information eller tillgång till nya resurser genom NordIQ, IT Ops och eventuell eskalering vid behov.

1. **Submit —** Medarbetaren skickar in ärendet via Teams, e-post eller webbportal.

2. **Triage —** NordIQ klassificerar ärendet automatiskt (FAQ / Incident / Request / Change).

3. **Fulfill —** AI-agenten löser 40–60 % av inkommande ärenden.

4. **Eskalering —** Resterande ärenden skickas till Anna (IT Ops) inom 2 minuter (kopplat till SLO 4).

5. **Verify and close —** Ärendet markeras som löst, användaren bekräftar eller ticket stängs automatiskt.

### **OLA per steg**

| Steg | Rubrik | OLA |
| :---- | :---- | :---- |
| 1 | Förfrågan skickas in | Registreras direkt |
| 2 | Ärendet klassificeras | Klassificering inom 2 sek |
| 3 | Första svar ges | Första AI-svar p95 \< 5 sek |
| 4 | Eskalering vid behov | Ticket/eskalering skapas inom 2 min |
| 5 | IT Ops hanterar | Hantering påbörjas enligt prioritet, t.ex. SEV1 inom 15 min, SEV2 inom 60 min |
| 6 | Stängning & lärande | Knowledge Base uppdateras inom 24 h vid känd förändring eller återkommande fel |

### **Detaljerat flöde**

| Steg | Namn | Vad som händer hos NordTech |
| :---- | :---- | :---- |
| 1 | Submit | Medarbetaren skickar in ärendet via Teams, e-post eller webbportal. Ärendet registreras direkt. |
| 2 | Triage | NordIQ klassificerar ärendet automatiskt som FAQ, Service Request, Incident eller Change. Klassificering sker inom 2 sekunder. |
| 3 | Approve | Om ärendet kräver godkännande skickas det till rätt godkännare, t.ex. chef, budgetägare, security eller dataägare. För fördefinierade låg-risk-ärenden kan godkännandet vara förhandsgodkänt. |
| 4 | Assign | Ärendet routas till rätt fulfiller: AI-agent, IT Ops, Incident Management, Change Enablement, Dev eller extern leverantör. Ärenden som AI inte kan hantera assignas vidare inom 2 minuter enligt SLO 4\. |
| 5 | Fulfill | AI-agenten löser cirka 40–60 % av inkommande ärenden. Övriga ärenden hanteras av rätt resolver enligt prioritet. Om ärendet är en incident används SEV-nivåer, t.ex. SEV1 inom 15 min och SEV2 inom 60 min. |
| 6 | Verify | Lösningen verifieras, antingen genom användarbekräftelse eller automatiserad kontroll. |
| 7 | Close | Ärendet stängs. Om ärendet visar en kunskapslucka eller återkommande fel uppdateras kunskapsbasen inom 24 timmar. |

# **3\.  Operational Readiness**

*How NordIQ runs day-to-day — and recovers when it breaks.*

## **Major-Incident Playbook**

Handlingsplan/krismanual för NordTechs hantering om NordIQ drabbas av ett allvarligt driftproblem efter go-live. Incidenter ska ses som en oplanerad händelse som orsakar ett avbrott.

#### **Stora incidenter som kan inträffa**

* NordIQ ligger nere

* Lumeon API svarar inte

* AI felklassar många ärenden

* Användare får felaktiga svar

* Eskalering till IT Ops fungerar inte

| Steg | Aktivitet | Ansvarig |
| :---- | :---- | :---- |
| Identifiering | Larm från övervakning eller att Lina (HR) ringer och säger att AI:n blivit galen. | IT Ops / Anna |
| Triage och deklaration | Bedöm: Påverkar detta alla? Ja → Deklarera Major Incident. | Incident Commander |
| Isolering / failover | Det viktigaste steget för NordIQ: Ska vi stänga av AI-chatten helt eller aktivera “Emergency Redirect” till gamla portalen? | Technical Lead (Karl) |
| Leverantörskontakt | Kontrollera status hos CloudFrame och Lumeon. Öppna akut-tickets hos dem. | IT-PM (vi) |
| Upplösning | Verifiera att tjänsten fungerar normalt igen (efter fix eller rollback). | Technical Lead (Karl) |
| Kommunikationsstopp | Informera organisationen om att faran är över. | Communications Lead (Lina) |

## **Problem-Management Approach**

### **5 Whys**

RCA-tillvägagångssätt för återkommande fel i NordIQ. För enkla, avgränsade problem används 5 Whys — en iterativ Root Cause Analysis som tar reda på anledningen till att ett fel inträffat genom att återkommande ställa frågan “Why?” fem gånger.

### **Contributing Factors**

För mer komplexa incidenter används Contributing Factors, eftersom fel kan bero på en kombination av AI-agenten, Knowledge Base, routing, människor och leverantörer.

Contributing Factors är en RCA som identifierar situation, systemets status, och vilka händelser som ökar sannolikheten för att en incident inträffar — men som inte är den primära orsaken till det ursprungliga felet. Detta görs genom systematiska undersökningar snarare än individuella fall.

## **Communication Plan (Internt)**

Kommunikationsplanen gällande incidenter för NordIQ följer Incident Ladder: först sker en intern triage, därefter riktas meddelanden till berörda användare och endast vid bred påverkan till alla användare.

Kommunikation sker på Fast Cadence. Communications Lead ansvarar för uppdateringar så att Incident Commander kan fokusera på koordinering.

CIO Martin får 30-minutersstatus vid större incidenter. CFO Erik kopplas in när leverantörsberoende eller avtalsmässiga konsekvenser kan vara relevanta, särskilt gällande CloudFrame Nordic eller Lumeon API.

| Målgrupp | När informeras de? | Vad behöver de veta? | Kanal / cadence |
| :---- | :---- | :---- | :---- |
| Anna / Ops \+ Karl / Dev | Direkt efter triage | Severity, påverkan, teknisk hypotes, vem som är IC/SME | War room / Teams, löpande |
| Martin, CIO | Vid Sev 1 eller större verksamhetspåverkan | Status, risk, beslutspunkter, nästa update | Var 30:e minut tills stabilt |
| Anställda / affected users | När användare påverkas | “Använd inte NordIQ-chatten just nu. Maila supporten istället.” \+ nästa uppdatering | Teams/mail, vid start \+ all-clear |
| Alla användare | Endast vid bred påverkan | Kort störningsinfo, workaround, när nästa besked kommer | Teams broadcast / intranät |
| Erik, CFO | Om leverantör kan vara orsak eller kostnad påverkas | Om CloudFrame/Lumeon verkar orsaka avbrottet, bevisläge, potentiellt vite/kontraktsfråga | Direkt ping \+ incidentrapport |
| CloudFrame / Lumeon | Om deras komponent misstänks | Tekniska symptom, tidslinje, SLA/UC-fråga, begärd åtgärd | Supplier ticket \+ eskalering |

## **Post-Incident Review (PIR)**

Efter en SEV1- eller SEV2-incident genomför NordTech en Post-Incident Review för att förstå vad som hände, varför det hände och vilka förbättringar som krävs. Syftet är att förbättra NordIQ som tjänst.

* Vad hände?

* Varför hände det? (Root cause)

* Hur ser vi till att det aldrig händer igen? (Input till Problem Management.)

## **Continual Improvement Register**

Registret behövs för att alla förbättringsförslag inte ska gå förlorade. Det ger teamen en grund att stå på vid förbättringar, tilldelar ägandeskap och skapar struktur — lite som en backlog.

Utöver registret bör det skapas en plan för hur ofta registret ska granskas, samt en retro över resultatet och hur förbättringen ska upprätthållas.

## **On-call & Escalation Map**

Detta är ett schema för att tydliggöra vem som är ansvarig vid Severity 1- och 2-incidenter (då dessa är så pass allvarliga att de måste få en snabb lösning). Om ansvarig medarbetare inte kan hantera incidenten ska det finnas en tydlig escalation map över vem den kan eskalera till. Rollerna är tillfälliga och axlas enbart när en incident inträffar.

I on-call-schemat ska det anges vem som är first point of contact och vem som kontaktas om denne inte är tillgänglig. Det ska finnas ett handover-protokoll så att all information kan överföras från ett skift till ett annat. Det måste även finnas information om vilka kompetenser de ansvariga har, så att personen som tilldelas en roll vid en incident har rätt kompetens för att axla den.

Följande roller är viktiga att ha. Dessa personer ska samlas i ett så kallat “war room” inom 15 minuter där incidenten diskuteras för att nå en lösning snabbt. Rummet behöver inte vara specifikt för ändamålet utan kan variera eller vara digitalt — syftet är att kunna samlas för att hantera incidenten. När en handlingsplan tagits fram ska alla uppdatera Incident Commander var 30:e minut tills problemet är löst.

## **Principer för NordIQ**

* **Blameless RCA —** utredningen frågar vilka systemförhållanden som tillät felet, inte vem som begick det.

* **Kopplade incidents är obligatoriska —** ett problem-ticket utan länkade incidents saknar faktaunderlag och hanteras inte.

* **Workarounds har ett bäst-före-datum —** failover-läget (omdirigering till SharePoint \+ manuell ticket) är en tillfällig lösning. Om det aktiveras fler än 2 gånger på 30 dagar öppnas ett problem-ticket för permanent åtgärd.

# **4\.  Change & Release**

*The plan to take NordIQ into production — and back out.*

## **CAB Design**

### **Change Authority**

**Martin Lindqvist (CIO)** — ansvarar över go-live-besluten och äger de politiska riskerna.

Martin Lindqvist är formell Change Authority för NordIQ go-live. Han äger det slutliga go/no-go-beslutet eftersom förändringen påverkar hela NordTechs interna supportmodell och innebär politisk risk mot ledning och verksamhet. CAB:s roll är att ge Martin ett tillräckligt komplett underlag för beslut, inte att ersätta hans ansvar.

### **Change Advisory Board**

**Anna Berg (IT Ops Lead)**

Ärver NordIQ efter go-live och behöver kunna lita på att tjänsten är driftbar. Hennes fokus är incidenthantering, eskalering, second-line-belastning och om tjänsten går att underhålla i vardagen.

**Karl Eek (Internal Dev Lead)**

Innehar förståelse för agentplattformen samt den tekniska risk som existerar bakom NordIQ. Hans roll i CAB är att förklara systemets begränsningar, AI-agentens beteende, integrationsrisker, tekniska beroenden och hur snabbt teamet kan åtgärda fel efter go-live.

**Erik Holm (CFO)**

Äger leverantörsavtalen med CloudFrame Nordic och Lumeon API samt följer kostnadsutvecklingen. Hans perspektiv är viktigt eftersom NordIQ är beroende av externa leverantörer och eftersom LLM-användning kan skapa rörliga kostnader som behöver vara synliga och kontrollerade.

**Lina Nordin (Head of HR)**

Är en av de tyngsta interna användarna av first-line support, särskilt vid onboarding, åtkomstfrågor och medarbetarrelaterade IT-behov. Hon representerar användarperspektivet och är troligen en av de första som märker om NordIQ ger felaktiga svar, har dålig användarupplevelse eller inte löser praktiska problem i vardagen. Linas feedback är därför viktig för UAT, adoption, continual improvement och för att bedöma om tjänsten faktiskt skapar värde för medarbetarna.

## **Go / No-Go Criteria**

Förbestämda tester för NordIQ måste uppnås för att tjänsten ska tillåtas rulla ut för release. Följande kriterier anses som goda för att uppnå en kvalitativ release för NordIQ. Governance-kriterier måste vara observerbara innan tjänsten får passera:

* En plan för hantering av kvarstående mindre fel. P2/P3 ska vara godkända av IT Ops.

* Mindre än fem procent av test-promptar får returnera felmeddelande.

* Gröna Health Checks genom 24 sammanhängande timmar.

* Skriftligt godkännande ska finnas underskrivet av samtliga i CAB.

* Samtliga acceptanskriterier är uppnådda och tester för normalflöden är godkända i kvalitetssäkrad miljö.

## **Request for Change (RFC)**

### **1\.  Purpose**

Syftet med RFC:n är att få ett formellt godkännande för att lansera NordIQ som AI-stödd first-line support. Förändringen ska minska väntetider, avlasta manuell support och ge medarbetare snabbare hjälp med vanliga IT-ärenden.

### **2\.  Scope**

RFC:n omfattar lansering av NordIQ för interna medarbetare på NordTech. Den inkluderar AI-agenten, Knowledge Base, klassificering av ärenden, escalation flow, fallback-lösning och koppling till befintligt ärendehanteringssystem.

### **3\.  Technical Change Description**

NordIQ införs som en AI-baserad supportkanal som kan ta emot, klassificera och besvara vanliga IT-supportfrågor. Tjänsten använder Lumeon API för AI-svar, CloudFrame Nordic för drift/hosting och befintliga system för eskalering och ticketing.

### **4\.  Risk Assessment**

De största riskerna är felaktiga AI-svar, felklassificering av ärenden, avbrott hos Lumeon API eller CloudFrame, föråldrad Knowledge Base och att eskalering till IT Ops inte fungerar. Riskerna hanteras genom SLO/SLI, monitoring, fallback, incident playbook och rollback-plan.

### **5\.  Rollback Plan**

Om NordIQ inte fungerar efter go-live kan tjänsten pausas och supportflödet återgå till tidigare arbetssätt. Användare kan då hänvisas till SharePoint FAQ och befintligt ticketing-system, medan manuell first-line support aktiveras vid behov.

### **6\.  Timeline and Window**

Go-live bör ske under en kontrollerad tidsperiod med låg belastning, exempelvis under arbetstid när IT Ops, Karl och leverantörer är tillgängliga. Efter lansering följs tjänsten extra noga under en hypercare-period.

### **7\.  Communication Plan**

Berörda medarbetare informeras innan go-live om vad NordIQ är, hur tjänsten används och hur ärenden eskaleras. Vid problem kommunicerar IT Ops status enligt incidentplanen, med uppdateringar till användare och relevanta stakeholders.

### **8\.  Approver List**

Go-live bör godkännas av Martin Lindqvist som CIO och beslutsägare, med input från Anna Berg för drift, Karl Eek för teknik, Erik Holm för leverantörs- och kostnadsrisker samt Lina Nordin för användarperspektivet.

## **Change Enablement — Rollback Plan**

### **Trigger**

* NordIQ ger ingen respons på mer än 10 % av inkommande requests.

* Lumeon API är otillgänglig i mer än 30 minuter.

* AI:ns felklassificeringsgrad överstiger accepterad nivå.

* Eskalering till IT Ops slutar fungera.

### **Rollback Steps**

1. Martin (Change Authority) godkänner beslut om rollback.

2. NordIQ tas offline.

3. Inkommande ärenden omdirigeras automatiskt till FAQ-sidor i SharePoint och tickets skapas i det befintliga ärendehanteringssystemet utan AI-hantering.

4. Anna och IT-teamet återtar full manuell first-line-hantering.

5. Lina (HR) och samtliga medarbetare meddelas via e-post.

### **What Stays, What Restores**

* AI-agentplattformen förblir driftsatt men inaktiv.

* Ingen data går förlorad — all ärendehistorik bevaras.

* Avtal med CloudFrame och Lumeon kvarstår.