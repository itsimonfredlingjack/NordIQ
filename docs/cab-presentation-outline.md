# CAB-presentation – NordIQ Go-Live

> **Dokumenttyp:** Presentationsstruktur (speaker notes)  
> **Presentatör:** Anna Berg (driftansvarig) + Karl Eek (tech)  
> **Till:** CAB / Martin Lindqvist  
> **Syfte:** Godkännande av go-live

---

> *Det här dokumentet fungerar som manus och disposition för CAB-presentationen. Varje avsnitt = ca 1 slide eller 2–3 minuters tal.*

---

## Slide 1 – Vad är NordIQ?

**Rubrik:** NordIQ – AI-stödd intern service desk för NordTech AB

**Punkter:**
- Intern IT-support via Teams, webbportal och mejl
- Tillgänglig 24/7 för alla ~450 medarbetare
- Direktsvar på vanliga frågor; strukturerade eskaleringar vid behov
- Byggt på Lumeon API (LLM) + CloudFrame Nordic (drift/hosting)

**Speaker notes:**
> "NordIQ är inte ett chattbot-experiment. Det är en definierad IT-tjänst med tydliga SLO:er, driftansvar och rollback-plan. Vi presenterar den som ett Go-Live Readiness Package, inte som en prototyp."

---

## Slide 2 – Varför go-live behövs nu

**Rubrik:** Behovet och tajmingen

**Punkter:**
- First line-volymen ökar med 15 % per år (antagande)
- Medarbetare saknar support utanför kontorstid
- Pilottest visar att tjänsten fungerar och ger värde
- Längre väntan = ökade alternativkostnader och frustration

**Speaker notes:**
> "Vi har testat detta. Piloten visade [X] % deflection rate och inga P1-incidenter. Vi är redo – med rätt villkor."

---

## Slide 3 – Värde och risker

**Rubrik:** Nytta och kvarstående risker

**Punkter:**
- **Nytta:** Tillgänglighet 24/7, deflection 40–60 %, spårbarhet, skalbarhet
- **Risker:** CloudFrame-driftstörning, Lumeon API-stabilitet, AI-feltolkning, adoption
- Alla risker har identifierade åtgärder och ägare
- Kvarstående residualrisk är acceptabel med villkor

**Speaker notes:**
> "Vi gömmer inte riskerna. R-01 (Lumeon API-avbrott) och R-02 (CloudFrame-driftstörning) är våra allvarligaste risker. Fallback-plan är testad. Vi kan stänga av NordIQ och gå tillbaka till manuell first line inom 15–30 minuter."

---

## Slide 4 – SLO:er och mätning

**Rubrik:** Hur vi vet att tjänsten levererar

| SLO | Mål | Mätning |
|-----|-----|---------|
| Tillgänglighet | 99,0 % / månad | [Antagande: dashboard från CloudFrame/övervakningsverktyg] |
| Första svar | 95 % inom 10 s | Lumeon-logg |
| Deflection rate | ≥ 40 % (go-live) | Ärendestatistik |
| P1/P2-eskalering | 100 % till människa | Incident-logg |

**Speaker notes:**
> "Vi har inte satt SLO:erna högt bara för att det låter bra. Dessa är satta utifrån vad som faktiskt är kritiskt för tjänstens värde och säkerhet. 99,0 % tillgänglighet innebär max 7 h avbrott per månad – realistiskt och mätbart."

---

## Slide 5 – Driftmodell och eskalering

**Rubrik:** Vem ansvarar för vad, post go-live

**Punkter:**
- Anna Berg: driftansvarig, SLO-ägare, hypercare-koordinator
- Karl Eek: plattformsansvarig, kunskapsbas, leverantörskontakt
- On-call-schema vecka 1–4: utökad bemanning 07–22
- P1/P2 eskaleras automatiskt – aldrig ensam AI-hantering

**Speaker notes:**
> "Anna har signerat driftövertagande. Det finns ett tydligt eskaleringsflöde med namn och kontaktuppgifter. Vi vet vem som ringer vem kl 02 på en lördag."

---

## Slide 6 – Leverantörsberoenden

**Rubrik:** Lumeon API & CloudFrame Nordic – status och hantering

| Leverantör | Funktion | SLA | Risk | Fallback |
|------------|---------|-----|------|---------|
| Lumeon API | LLM-leverantör | P1: 30 min | Kritisk | Manuell first line |
| CloudFrame Nordic | Drift och hosting | P1: 30 min | Kritisk | Manuell first line |

**Speaker notes:**
> "Båda leverantörer har bekräftat produktionsredo status [datum]. SLA-kraven är dokumenterade. Vi är inte naiva – vi har planerat för att båda kan gå ner, var för sig eller samtidigt."

---

## Slide 7 – RFC och go/no-go

**Rubrik:** RFC-NordIQ-001 – Go/no-go-kriterier

**Punkter:**
- RFC-ID: RFC-NordIQ-001
- Alla go/no-go-kriterier är [uppfyllda / under verifiering]
- Testbevis: funktionstest, lasttest, säkerhetstest, rollback-test
- Rekommendation: **Go-live med villkor**

**Villkor:**
1. Alla SLO-baslinjer stabila ≥ 5 dagar
2. Rollback-plan testad och signerad
3. Anna Berg har signerat driftövertagande

**Speaker notes:**
> "Vi ber inte om ett blankt godkännande. Vi ber om ett villkorat go-live där alla tre villkoren verifieras senast [datum]. Om de inte är uppfyllda, senareläggs go-live – inte avbryts."

---

## Slide 8 – Rollback

**Rubrik:** Om något går fel – vad händer?

**Punkter:**
- Trigger: P1 olöst > 2 h, deflection < 20 %, säkerhetsincident
- NordIQ inaktiveras: < 15 minuter
- Medarbetare dirigeras till manuell first line via Teams
- Root cause-analys startar omedelbart
- Martin Lindqvist informeras inom 1 timme

**Speaker notes:**
> "Rollback är testad. Vi vet att vi kan göra det. Tröskeln är satt för att undvika onödiga rollbacks men låg nog för att skydda medarbetarna."

---

## Slide 9 – Rekommendation

**Rubrik:** CAB-rekommendation

> **Go-live med villkor**

**Grupperbjudandet till CAB:**
- Alla risker är identifierade och hanterade
- Driftansvar är tydligt
- Rollback är testad
- Hypercare-plan finns

**Vi ber CAB om:**
1. Godkännande av RFC-NordIQ-001 med de tre villkoren
2. Bekräftelse av go-live-datum
3. Mandat till Anna Berg att aktivera rollback om villkoren inte håller

**Speaker notes:**
> "Det här är ett moget underlag. Vi är redo att ta ansvaret för go-live. Vi ber inte om perfekta förhållanden – vi ber om ett tydligt mandat med tydliga villkor."
