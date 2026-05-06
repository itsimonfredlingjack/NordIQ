# Executive Summary - NordIQ Go-Live

> **Dokumenttyp:** Beslutsunderlag  
> **Till:** CAB, CIO Martin Lindqvist  
> **Datum:** Ej satt  
> **Version:** 1.0  
> **Status:** Utkast - ej CAB-klar

---

## 1. Beslut som begärs

CAB ombeds granska om NordIQ kan godkännas för go-live **när** villkoren i avsnitt 5 är verifierade. Detta dokument är ett utkast till beslutsunderlag, inte bevis på att villkoren redan är uppfyllda.

---

## 2. Rekommendation

> **Preliminär rekommendation: Go-live med villkor**

NordIQ adresserar ett tydligt verksamhetsbehov: first-line service desk hanterar cirka 70 ärenden per dag över 4 personer, med 2,5 dagars genomsnittlig resolution och cirka 40 % återkommande/FAQ-klassade ärenden. En AI-stödd intern service desk kan ge värde om den mäts, styrs och kan backas ur kontrollerat.

Rekommendationen är därför inte ett färdigt go-live-godkännande. Den är att fortsätta mot CAB med villkorade go/no-go-kriterier, tydliga SLO:er, dokumenterad rollback och verifierade leverantörsberoenden.

---

## 3. Nytta

| Nytta | Beskrivning |
|-------|-------------|
| Tillgänglighet | Målbilden är support 24/7 för cirka 450 medarbetare, särskilt utanför kontorstid och måndag morgon-köer. |
| Avlastning first line | Case-data visar att cirka 40 % av ärendena är återkommande/FAQ-klassade; NordIQ har målbilden 40-60 % first-line deflection. |
| Spårbar eskalering | Ärenden som inte kan lösas direkt ska eskaleras strukturerat till människa via befintligt ärendehanteringssystem. |
| Bättre förbättringsdata | Återkommande frågor, felklassificeringar och kunskapsluckor blir input till Continual Improvement. |
| Onboardingstöd | Lina Nordins område påverkas eftersom onboarding driver många repetitiva supportfrågor. |

---

## 4. Risker (sammanfattning)

| Risk | Sannolikhet | Påverkan | Föreslagen hantering |
|------|-------------|----------|----------------------|
| CloudFrame Nordic nere | Låg/Medel | Kritisk | CloudFrame är hostingplattform för AI Agent Platform; fallback till manuell first line krävs. |
| Lumeon API nere eller instabilt | Medel | Hög | Lumeon är LLM API för agentlagret; agentens svarsförmåga kan behöva pausas. |
| AI ger felaktigt svar | Medel | Medel/Hög | Kunskapsbasstyrning, mänsklig eskalering och förbättringsregister krävs. |
| P1/P2 fastnar hos agenten | Låg | Kritisk | P1/P2 ska alltid eskaleras till människa; detta måste verifieras före go-live. |
| Tokenkostnad ökar | Medel | Medel | LLM-användning via Lumeon API behöver följas upp som kostnadsrisk. |

*Se fullständigt riskregister: [risk-register.md](risk-register.md).*

---

## 5. Villkor för go-live

- [ ] Baseline för SLO:er är mätt i test-/pilotmiljö innan CAB-beslut.
- [ ] Rollback-plan är dokumenterad och verifierad innan produktionssättning.
- [ ] Anna Berg har granskat och accepterat driftövertagande som go-live-förutsättning.
- [ ] CloudFrame Nordic och Lumeon API har granskats som leverantörsberoenden, inklusive vad deras SLA:er faktiskt stödjer.
- [ ] Kommunikationsplan till medarbetare är färdigställd innan go-live.
- [ ] On-call- och eskaleringsvägar för hypercare är beslutade innan go-live.

---

## 6. Kvarstående risk

Även efter ett villkorat go-live-beslut finns residualrisk kring AI-svarskvalitet, Lumeon API:s LLM-beroende, CloudFrame som hostingberoende och kunskapsbasens kvalitet. Dessa risker ska hanteras genom SLO-uppföljning, incident-/problemhantering och Continual Improvement.

---

## 7. Nästa steg

| Steg | Ansvarig | Status |
|------|----------|--------|
| Slutlig go/no-go-kontroll | Anna Berg | Planerad verifiering |
| CAB-möte | Martin Lindqvist | Ej schemalagt i detta underlag |
| Go-live-beslut | CAB / Martin Lindqvist | Ej fattat |
| Hypercare-start | Anna Berg | Beroende av CAB-beslut |
| Första CI-genomgång | Anna Berg | Planerad efter go-live |
