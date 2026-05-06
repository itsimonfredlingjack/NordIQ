# CAB-presentation - NordIQ Go-Live

> **Dokumenttyp:** Presentationsstruktur (speaker notes)  
> **Presentatör:** Anna Berg (driftansvarig) + Karl Eek (tech)  
> **Till:** CAB / Martin Lindqvist  
> **Syfte:** Villkorat beslut om go-live  
> **Status:** Utkast - inga test- eller pilotresultat är etablerade i detta underlag

---

> *Det här dokumentet fungerar som manus och disposition för CAB-presentationen. Varje avsnitt motsvarar ungefär en slide eller 2-3 minuters tal.*

---

## Slide 1 - Vad är NordIQ?

**Rubrik:** NordIQ - AI-stödd intern service desk för NordTech AB

**Punkter:**
- Intern IT-supporttjänst för cirka 450 medarbetare.
- Målbild: 24/7-ingång för återkommande first-line-frågor.
- Direktsvar när kunskapsunderlaget räcker; strukturerad eskalering när människa behövs.
- CloudFrame Nordic hostar AI Agent Platform; Lumeon API är LLM API för agentlagret.

**Speaker notes:**
> "NordIQ ska presenteras som en IT-tjänst, inte som ett chattbot-experiment. Frågan till CAB är inte om tekniken är spännande, utan om tjänsten kan gå live med tillräcklig driftberedskap, mätning och rollback."

---

## Slide 2 - Varför go-live övervägs

**Rubrik:** Behovet och tajmingen

**Punkter:**
- First line hanterar cirka 70 ärenden per dag över 4 personer.
- Genomsnittlig resolution är 2,5 dagar.
- Cirka 40 % av ärendena är återkommande/FAQ-klassade.
- NordIQs målbild är 40-60 % first-line deflection, men faktisk baseline måste mätas.

**Speaker notes:**
> "Case-datan visar ett tydligt demand-push: first line är hårt belastad. Opportunity-pull är att AI-agenter kan ta återkommande ärenden, men det är bara relevant om vi kan styra riskerna och mäta effekten."

---

## Slide 3 - Värde och risker

**Rubrik:** Nytta och kvarstående risker

**Punkter:**
- **Nytta:** 24/7-ingång, lägre repetitiv belastning, bättre eskaleringsdata.
- **Risker:** CloudFrame-hosting, Lumeon API/LLM, AI-feltolkning, adoption.
- Risker har föreslagna ägare och åtgärder, men flera kontroller är ännu inte verifierade.
- CAB bör besluta om villkor, inte ge ett blankt godkännande.

**Speaker notes:**
> "Vi ska inte gömma riskerna. CloudFrame och Lumeon API är kritiska leverantörsberoenden. Dessutom kan AI-svar vara fel även när tekniken är uppe. Det är därför SLO:er, mänsklig eskalering och rollback finns i paketet."

---

## Slide 4 - SLO:er och mätning

**Rubrik:** Hur vi vet om tjänsten levererar

| SLO | Arbetsmål | Mätning |
|-----|-----------|---------|
| Tillgänglighet | 99,0 % / månad som första internt mål | NordIQ/CloudFrame-hostad plattform |
| Första svar | 95 % inom 10 s som antagande | NordIQ-/agentlogg |
| Deflection | 40 % första mål, upp mot 60 % efter stabilisering | Andel direkt lösta ärenden |
| P1/P2-eskalering | 100 % till människa | Incidentlogg + agentklassificering |

**Speaker notes:**
> "Det här är mål och mätmetoder, inte resultat. Baseline måste mätas innan vi använder siffrorna som bevis. Ett SLO utan baseline är en gissning."

---

## Slide 5 - Driftmodell och eskalering

**Rubrik:** Vem ansvarar för vad, post go-live

**Punkter:**
- Anna Berg: driftmottagare, SLO-ägare och incidentansvar.
- Karl Eek: plattform, agentlager och teknisk felsökning.
- First line och second line behöver tydliga request models och eskaleringsvägar.
- P1/P2 ska eskaleras till människa; AI-agenten får inte vara ensam slutpunkt.

**Speaker notes:**
> "Det som behöver vara klart före go-live är inte bara tekniken. Anna måste kunna ta emot tjänsten: veta vem som larmas, var ärenden hamnar och hur agenten pausas om den beter sig fel."

---

## Slide 6 - Leverantörsberoenden

**Rubrik:** CloudFrame Nordic & Lumeon API - constraints

| Leverantör | Funktion | Risk | Fallback |
|------------|----------|------|----------|
| CloudFrame Nordic | Hostingplattform för AI Agent Platform | Om hosting är nere är NordIQ nere eller degraderad. | Manuell first line; leverantörseskalering enligt faktisk SLA. |
| Lumeon API | LLM API för agentlagret | Om LLM API är nere/instabilt påverkas agentens svarsförmåga och tokenkostnad. | Pausa AI-svar och använd manuell first line. |

**Speaker notes:**
> "Leverantörerna är constraints. Vi kan inte sätta interna mål som är starkare än vad CloudFrame, Lumeon API och våra interna team faktiskt kan stödja."

---

## Slide 7 - RFC och go/no-go

**Rubrik:** RFC-NordIQ-001 - villkorat beslut

**Punkter:**
- RFC-ID: RFC-NordIQ-001.
- Go/no-go-kriterier är definierade men inte verifierade i detta utkast.
- Testbevis, rollback-genomgång, driftövertagande och leverantörsconstraints krävs före faktisk go-live.
- Rekommendation: **Go-live med villkor**, inte omedelbar produktionssättning.

**Villkor:**
1. SLO-baseline mätt i test-/pilotmiljö.
2. Rollback-plan dokumenterad och genomgången.
3. Anna Berg accepterar driftövertagande.
4. CloudFrame- och Lumeon-constraints är granskade mot faktiska avtal.

**Speaker notes:**
> "Vi ber inte CAB att låtsas att allt är klart. Vi ber om ett villkorat beslut där varje blockerande villkor måste verifieras före produktionssättning."

---

## Slide 8 - Rollback

**Rubrik:** Om något går fel - vad händer?

**Punkter:**
- Trigger: P1/P2 fastnar hos agenten, allvarlig leverantörsstörning, säkerhetsrisk eller fundamentalt dålig svarskvalitet.
- NordIQ-agentförmågan pausas.
- Medarbetare dirigeras till manuell first line.
- Ärenden fortsätter i befintligt ärendehanteringssystem.
- Root cause-analys och CAB-återkoppling följer.

**Speaker notes:**
> "Rollback ska inte beskrivas som redan testad. Det är ett go-live-villkor. Poängen är att vi vet vilken förmåga som måste verifieras innan CAB ger slutligt klartecken."

---

## Slide 9 - Rekommendation

**Rubrik:** CAB-rekommendation

> **Preliminär rekommendation: Go-live med villkor**

**Vi ber CAB om:**
1. Godkännande av RFC-NordIQ-001 som villkorad plan.
2. Bekräftelse på vilka verifieringar som blockerar faktisk go-live.
3. Mandat till Anna Berg att stoppa eller pausa NordIQ om villkoren inte håller.

**Speaker notes:**
> "Det här är ett moget underlag just för att det inte låtsas att allt redan är bevisat. Vi visar vad tjänsten är, vilka risker den skapar, vilka mål som ska mätas och vilka villkor som måste stängas innan go-live."
