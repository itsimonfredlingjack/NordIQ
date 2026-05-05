# Change & Release – RFC för Go-Live av NordIQ

> **RFC-ID:** RFC-NordIQ-001  
> **Dokumenttyp:** Request for Change  
> **Initierad av:** Karl Eek  
> **Driftansvarig:** Anna Berg  
> **Godkänns av:** CAB / Martin Lindqvist  
> **Datum:** [YYYY-MM-DD]  
> **Version:** 1.0

---

## 1. Bakgrund

NordTech AB har under [tidsperiod] byggt och testat NordIQ – en AI-stödd intern service desk. Syftet är att avlasta first-line support, förbättra tillgängligheten för medarbetare och skapa spårbar ärendehantering dygnet runt.

Pilottester med [antal] medarbetare har genomförts. Resultaten visar att tjänsten är tekniskt stabil och att deflection rate under piloten uppnådde [X] %. Kvarstående risker är identifierade och åtgärdsplaner finns.

---

## 2. Scope

Denna RFC täcker:
- Produktionssättning av NordIQ i Teams, webbportal och mejl-integration
- Aktivering av Lumeon-integration i produktion
- Aktivering av CloudFrame Nordic AI-motor i produktion
- Publisering av kunskapsbas (initialt: [antal] artiklar)
- Kommunikation till alla ~800 medarbetare på NordTech AB

---

## 3. Out of Scope

- Ändringar i befintliga second-line-processer (utöver eskaleringsflöde)
- Integration med externa system (framtida fas)
- HR-systemintegration utöver onboarding-FAQ
- Automatisk problemhantering (aktiveras i fas 2)

---

## 4. Påverkade Användare

| Grupp | Antal | Påverkan |
|-------|-------|----------|
| Alla medarbetare | ~800 | Ny kanal för IT-support |
| First line support | ~5 pers | Förändrad arbetsbelastning; färre grundfrågor |
| Second line / Dev | ~10 pers | Tar emot strukturerade eskaleringar från NordIQ |
| Anna Berg | 1 | Nytt driftansvar |
| Karl Eek | 1 | Plattformsansvar kvarstår post go-live |

---

## 5. Risker

| Risk | Sannolikhet | Påverkan | Åtgärd |
|------|-------------|----------|--------|
| Lumeon API instabilt i produktion | Medel | Hög | Fallback-procedur till manuell first line aktiveras |
| Låg adoption bland medarbetare | Medel | Medel | Kommunikationskampanj + ambassadörsprogram |
| AI-svar med fel information | Medel | Medel | Human-in-the-loop för alla P1/P2; kvalitetsgranskning vecka 1–2 |
| Hög tokenkostnad | Låg | Medel | Kostnadslarm satt; granskas vecka 2 |

*Fullständigt riskregister: [risk-register.md](risk-register.md)*

---

## 6. Testbevis

| Test | Resultat | Utfört av | Datum |
|------|----------|-----------|-------|
| Funktionstest – Teams-kanal | ✅ Godkänt | Karl Eek | [datum] |
| Funktionstest – webbportal | ✅ Godkänt | Karl Eek | [datum] |
| Integrationstest – Lumeon API | ✅ Godkänt | Karl Eek | [datum] |
| Lastest (100 simultana användare) | ✅ Godkänt | [testansvarig] | [datum] |
| Säkerhetstest (pen test) | ⚠️ Godkänt med anmärkning | [extern] | [datum] |
| Rollback-test | ✅ Godkänt | Karl Eek + Anna Berg | [datum] |
| Pilot (50 medarbetare, 5 dagar) | ✅ Deflection [X] %, SLO uppnådda | Anna Berg | [datum] |

> **Antagande:** Säkerhetstestets anmärkning gäller [beskriv kort]. Åtgärdas senast [datum] och är inte ett go-live-blockerande fynd.

---

## 7. Kommunikationsplan

| Aktivitet | Kanal | Ansvarig | Datum |
|-----------|-------|----------|-------|
| Pre-announcement till chefer | Mejl från Martin Lindqvist | Martin Lindqvist | [datum - 7 dagar] |
| All-staff-kommunikation | Teams + intranät | Anna Berg | [datum - 3 dagar] |
| Instruktionsvideo / FAQ | SharePoint | Karl Eek | [datum - 3 dagar] |
| Go-live-bekräftelse | Teams-meddelande | Anna Berg | Go-live-dagen |
| Feedback-enkät (vecka 2) | Teams / e-post | Anna Berg | [datum + 14 dagar] |

---

## 8. Go/No-Go-kriterier

Alla nedanstående kriterier måste vara uppfyllda för att go-live ska genomföras:

| Kriterium | Godkänns av | Status |
|-----------|-------------|--------|
| Alla SLO-baslinjer stabila ≥ 5 dagar i staging | Karl Eek | ☐ |
| Rollback-plan testad och dokumenterad | Anna Berg | ☐ |
| CloudFrame och Lumeon bekräftar produktionsredo | Karl Eek | ☐ |
| Driftövertagande signerat av Anna Berg | Anna Berg | ☐ |
| Kommunikation till medarbetare skickad | Anna Berg | ☐ |
| On-call-schema klart (4 veckor) | Anna Berg | ☐ |
| CAB formellt godkänt denna RFC | Martin Lindqvist | ☐ |

---

## 9. Rollback-plan

**Trigger för rollback:** Ett eller flera av följande inträffar under go-live eller hypercare:
- P1-incident som inte kan lösas inom 2 timmar
- Deflection rate sjunker under 20 % (tyder på fundamentalt fel)
- Säkerhetsincident med dataexponering

**Rollback-steg:**

1. Anna Berg fattar beslut om rollback (konsulterar Karl Eek)
2. NordIQ-botarna i Teams/webbportal inaktiveras (< 15 min)
3. Medarbetare dirigeras tillbaka till manuell first line via Teams-meddelande
4. Lumeon-integration pausas; tickets hanteras manuellt
5. Root cause-analys startar omedelbart
6. Karl Eek och Anna Berg rapporterar till Martin Lindqvist inom 1 timme

**Estimerad tid för rollback:** 15–30 minuter  
**Testad:** ☐ Ja / ☐ Nej

*Se fullständig rollback-plan: [templates/rollback-plan-template.md](../templates/rollback-plan-template.md)*

---

## 10. Hypercare

**Period:** Vecka 1–4 post go-live  
**Ansvarig:** Anna Berg

| Aktivitet | Frekvens | Ansvarig |
|-----------|----------|----------|
| Daglig SLO-granskning | Dagligen | Anna Berg |
| On-call bemanning (utökad) | 07–22 vardagar, 09–17 helger | Anna Berg + Karl Eek |
| Veckogenomgång av incidenter och deflection | Veckovis | Anna Berg + Karl Eek |
| Kommunikation till medarbetare (status) | Vid behov | Anna Berg |
| Eskalering till Martin Lindqvist | Vid P1 eller trendavvikelse | Anna Berg |

**Hypercare avslutas när:** Alla SLO:er är stabila under 2 på varandra följande veckor.

---

## 11. CAB-beslut

| Beslut | Datum | Beslutsfattare | Anteckningar |
|--------|-------|----------------|--------------|
| ☐ Godkänd – go-live | | | |
| ☐ Godkänd med villkor | | | Villkor: |
| ☐ Avslag – återkoppla | | | Orsak: |

> **Rekommendation:** Go-live med villkor. Alla go/no-go-kriterier ska vara uppfyllda och bekräftade skriftligt av Anna Berg och Karl Eek innan produktionssättning.
