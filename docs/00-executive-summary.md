# Executive Summary – NordIQ Go-Live

> **Dokumenttyp:** Beslutsunderlag  
> **Till:** CAB, CIO Martin Lindqvist  
> **Datum:** [YYYY-MM-DD]  
> **Version:** 1.0  
> **Status:** Utkast / Klar för CAB

---

## 1. Beslut som begärs

CAB ombeds att **godkänna go-live av NordIQ** med de villkor som anges i avsnitt 5.

---

## 2. Rekommendation

> **Go-live med villkor**

NordIQ har uppnått de tekniska och operationella förutsättningarna för go-live. Kvarstående risker är identifierade, åtgärdsplaner finns och en rollback-plan är testad. Rekommendationen är att godkänna go-live under förutsättning att alla go/no-go-kriterier är uppfyllda senast [datum].

---

## 3. Nytta

| Nytta | Beskrivning |
|-------|-------------|
| Tillgänglighet | Medarbetare får support 24/7, även utanför kontorstid |
| Avlastning first line | Antagande: 40–60 % av ärenden deflekteras direkt |
| Spårbarhet | Alla ärenden loggas och eskaleras strukturerat |
| Skalbarhet | Kapaciteten kan ökas utan proportionell personalkostnad |
| Snabbare onboarding | Lina Nordin: nya medarbetare får direktsvar på vanliga frågor |

---

## 4. Risker (sammanfattning)

| Risk | Sannolikhet | Påverkan | Åtgärd |
|------|-------------|----------|--------|
| Lumeon API nere | Medel | Hög | Fallback till manuell first line |
| AI ger felaktigt svar | Medel | Medel | Human-in-the-loop för P1/P2 |
| P1 fastnar hos agenten | Låg | Kritisk | Automatisk eskalering efter 60 s |
| Tokenkostnad ökar | Medel | Medel | Budgetlarm och review Q1 |

*Se fullständigt riskregister: [risk-register.md](risk-register.md)*

---

## 5. Villkor för go-live

- [ ] Alla SLO-baslinjer mäts och är stabila under minst 5 dagar i staging
- [ ] Rollback-plan är testad och dokumenterad
- [ ] Anna Berg har signerat driftövertagande
- [ ] Karl Eek har bekräftat integrationsstatus CloudFrame och Lumeon
- [ ] Kommunikation till medarbetare är skickad senast [datum]
- [ ] On-call-schema är satt för hypercare-perioden (vecka 1–4)

---

## 6. Kvarstående risk

Även efter go-live finns en residualrisk kring Lumeon API:s stabilitet och kunskapsbasens täckningsgrad. Dessa risker hanteras inom ramen för Continual Improvement-processen och granskas månadsvis av Anna Berg.

---

## 7. Nästa steg

| Steg | Ansvarig | Datum |
|------|----------|-------|
| Slutlig go/no-go-kontroll | Anna Berg | [datum] |
| CAB-möte | Martin Lindqvist | [datum] |
| Go-live | Karl Eek | [datum] |
| Hypercare-avslut och review | Anna Berg | [datum + 30 dagar] |
| Första CI-genomgång | Anna Berg | [datum + 60 dagar] |
