# Service Levels & SLO:er - NordIQ

> **Dokumenttyp:** SLO-definition  
> **Ägare:** Anna Berg  
> **Granskad av:** Karl Eek  
> **Version:** 1.0  
> **Status:** Utkast - mål och mätmetoder måste verifieras före CAB

---

## Case-baseline

SLO:erna nedan är arbetsmål, inte uppnådda resultat. De bygger på skolmaterialets case-data:

| Baseline | Uppgift |
|----------|---------|
| Medarbetare | cirka 450 |
| Nuvarande first-line-volym | cirka 70 ärenden/dag |
| Nuvarande first-line-bemanning | 4 personer |
| Nuvarande genomsnittlig resolution | 2,5 dagar |
| Återkommande/FAQ-klassade ärenden | cirka 40 % |
| NordIQ-målbild | 40-60 % first-line deflection |
| Serviceambition | 24/7 |
| Supplier constraints | CloudFrame Nordic som hostingplattform; Lumeon API som LLM API för agentlagret |

---

## SLO-tabell

| # | Område | Mål | Mätning | Varför | Källa/antagande | Constraint |
|---|--------|-----|---------|--------|------------------|------------|
| 1 | **Tillgänglighet** | Arbetsmål: 99,0 % per månad för NordIQ-ingången, exkl. planerat underhåll. | Planerad verifiering via syntetisk övervakning av NordIQ och CloudFrame-hostad plattform. | 24/7-idén saknar värde om tjänsten ofta är nere. | Antagande: 99,0 % är rimligt första internt mål; baseline saknas. | Får inte sättas högre än CloudFrame Nordic och intern driftkedja kan stödja. |
| 2 | **Första svar** | Arbetsmål: 95 % av förfrågningar får första svar inom 10 sekunder. | NordIQ-/agentlogg. Lumeon API-latens följs separat som LLM-beroende. | Lång väntan driver medarbetare tillbaka till manuell first line. | Antagande: 10 sekunder behöver verifieras mot användarupplevelse och teknisk baseline. | Påverkas av Lumeon API, CloudFrame-hosting och kanalernas svarstid. |
| 3 | **Deflection** | Första målbild: minst 40 % direkt lösta FAQ-/återkommande ärenden; stabiliseringsmål upp mot 60 %. | Andel ärenden som stängs utan mänsklig first-line-hantering. | Caset anger cirka 40 % återkommande/FAQ och att 60 % first-line deflection ser möjlig ut. | Källfakta från skolmaterialet; faktisk baseline måste mätas. | Får inte pressas så hårt att felaktiga AI-svar eller missade eskaleringar ökar. |
| 4 | **Eskaleringskvalitet** | Arbetsmål: 90 % av eskalerade ärenden har kategori, sammanfattning, prioritet och nästa steg. | Stickprov och fältvalidering i befintligt ärendehanteringssystem. | Second line ska inte få sämre, tunnare eller felroutade ärenden. | Antagande: 90 % är första internt mål; måste baselinas i pilot/test. | Kräver fungerande request model och tydlig gräns mellan request, incident, change och query. |
| 5 | **P1/P2 till människa** | 100 % av P1/P2-ärenden ska eskaleras till människa; ingen tolerans för fastnade P1/P2. | Jämför incidentlogg, agentklassificering och ärendehistorik. | Kritiska incidenter får inte lösas autonomt av AI-agenten. | SLO-målet följer av risknivå, men mätningen måste verifieras. | Kräver tydliga incidentregler, on-call-väg och fallback om agenten är osäker. |
| 6 | **Kunskapsbasaktualitet** | 100 % av artiklar som agenten får använda ska ha ägare och reviewdatum. | Inventering av valt kunskapsbasverktyg. | Inaktuella artiklar ger fel svar och sänker förtroendet. | Antagande: exakt kunskapsbasverktyg är inte etablerat i skolmaterialet. | Kräver ägarskap hos Karl/berörda processägare och återkommande review. |
| 7 | **CloudFrame hosting dependency** | CloudFrame-incidenter som påverkar NordIQ ska synas i incidenthanteringen och ingå i go/no-go. | Leverantörsstatus, incidentrapport och intern påverkan. | CloudFrame hostar AI Agent Platform; om plattformen är nere är NordIQ nere. | Källfakta: CloudFrame är etablerad leverantör med SLA enligt caset. Exakta responstider behöver verifieras. | Internt SLO kan inte vara starkare än CloudFrame-avtalet och faktisk driftförmåga. |
| 8 | **Lumeon API / LLM dependency** | Lumeon API-avvikelser ska följas som LLM-beroende, inklusive tillgänglighet, latens och tokenkostnad. | Lumeon API-/LLM-användningsdata, om sådan rapportering finns tillgänglig. | Lumeon mäts som agentlagrets LLM-beroende. | Källfakta: Lumeon API är token-prissatt och SLA är endast ytligt testad. | Agentens svarsförmåga och kostnad styrs av Lumeon API; fallback måste kunna pausa agentens svar utan att stoppa manuell handläggning. |

---

## Mål, mätning och antaganden

- SLO:erna är **internt målmaterial** inför go-live, inte SLA till externa kunder.
- Baseline måste mätas innan målen används som CAB-bevis. SLM-materialet säger uttryckligen att target utan baseline är gissning.
- Leverantörernas SLA:er och UCs begränsar vad NordTech rimligen kan lova internt.
- Supplier metrics är constraints, inte separata bevis på att NordIQ är redo.
- Första veckornas pilot eller begränsad rollout ska användas för att kalibrera målen, inte för att efterhandsuppfinna uppnådda resultat.

---

## Go/No-Go-kriterier baserade på SLO:er

Nedanstående kriterier ska vara uppfyllda eller explicit accepterade som risk innan CAB kan rekommendera go-live.

| Kriterium | Tröskel | Verifieras av | Status |
|-----------|---------|---------------|--------|
| Tillgänglighet är baselinemätt i test-/pilotmiljö | Mätperiod definierad före CAB | Karl Eek | Ej verifierat |
| Deflection mäts mot faktiskt inflöde | Källvolym och definition dokumenterad | Anna Berg | Ej verifierat |
| P1/P2 fastnar inte hos AI-agenten | 0 accepterade missar | Anna Berg | Krävs före CAB |
| Eskaleringskvalitet är stickprovsgranskad | Stickprovsmetod dokumenterad | Karl Eek | Ej verifierat |
| Kunskapsbasartiklar som agenten använder har ägare | 100 % för go-live-scope | Karl Eek | Planerad verifiering |
| CloudFrame- och Lumeon-beroenden är genomgångna mot faktiska SLA:er | Dokumenterad constraint per leverantör | Anna Berg / Erik Holm | Ej verifierat |

> **Om kriterier inte är uppfyllda:** Rekommendationen ska vara begränsad rollout, senarelagt go-live eller uttryckligt riskacceptansbeslut från CAB. Inga pilotresultat får anges utan faktisk mätning.

---

## Uppföljning

- **Frekvens:** Daglig uppföljning under eventuell hypercare; månadsvis när tjänsten är stabil.
- **Forum:** IT Ops-möte med Anna Berg, Karl Eek och berörda processägare.
- **Rapportformat:** Planerad SLO-rapport eller dashboard. Exakt verktyg är inte etablerat i skolmaterialet.
