# Change & Release - RFC för Go-Live av NordIQ

> **RFC-ID:** RFC-NordIQ-001  
> **Dokumenttyp:** Request for Change  
> **Initierad av:** Karl Eek  
> **Driftansvarig:** Anna Berg  
> **Godkänns av:** CAB / Martin Lindqvist  
> **Datum:** Ej satt  
> **Version:** 1.0  
> **Status:** Utkast inför CAB - ej genomförd change

---

## 1. Bakgrund

NordTech AB planerar NordIQ som en AI-stödd intern service desk. Caset anger att first-line service desk är överbelastad med cirka 70 ärenden per dag över 4 personer, 2,5 dagars genomsnittlig resolution och cirka 40 % återkommande/FAQ-klassade ärenden.

Denna RFC beskriver vilka villkor som behöver vara uppfyllda innan NordIQ kan gå live. Den dokumenterar inte att pilot, test, rollback eller leverantörsbekräftelser redan är genomförda.

---

## 2. Scope

Denna RFC täcker föreslagen produktionssättning av:

- NordIQ som intern service desk-ingång för cirka 450 medarbetare.
- De kanaler som beslutas för go-live, exempelvis Teams, mejl eller webbportal.
- CloudFrame Nordic som hostingplattform för AI Agent Platform.
- Lumeon API som LLM API för agentlagret.
- Befintligt ärendehanteringssystem för ärenden som behöver mänsklig hantering.
- Initial kunskapsbas för de ärendetyper som ingår i go-live-scope.
- Kommunikation till NordTechs medarbetare innan go-live.

---

## 3. Out of Scope

- Byte av leverantörer eller omförhandling av avtal; studentteamet har inget budget- eller upphandlingsmandat.
- Nyanställning eller bemanningsförändring.
- Full automatisering av problem management.
- Externa kund-SLA:er eller kommersiella kundavtal.
- Tekniska integrationsdetaljer som inte stöds av skolmaterialet.

---

## 4. Påverkade användare

| Grupp | Antal | Påverkan |
|-------|-------|----------|
| Alla medarbetare | cirka 450 | Ny eller tydligare intern supportväg. |
| First line support | 4 personer | Mindre repetitivt inflöde om deflection fungerar; förändrad roll vid eskalering. |
| Second line / specialistgrupper | Ej specificerat | Tar emot strukturerade eskaleringar från NordIQ. |
| Anna Berg | 1 | Driftmottagare post go-live. |
| Karl Eek | 1 | Plattform och agentlager behöver stödja driftkraven. |
| Erik Holm | 1 | Äger leverantörsavtal och kostnadsfrågor. |
| Lina Nordin | 1 | Påverkas särskilt vid onboardingärenden. |

---

## 5. Risker

| Risk | Sannolikhet | Påverkan | Föreslagen åtgärd |
|------|-------------|----------|-------------------|
| CloudFrame-hosting instabil | Låg/Medel | Kritisk | Fallback till manuell first line och eskalering enligt leverantörsavtal. |
| Lumeon API / LLM instabilt | Medel | Hög | Pausa AI-svarsförmåga och använd manuell first line. |
| Låg adoption bland medarbetare | Medel | Medel | Kommunikationsplan och enkel väg till människa. |
| AI-svar med fel information | Medel | Medel/Hög | Kunskapsbasägarskap, mänsklig eskalering och CI-register. |
| Hög tokenkostnad | Medel | Medel | Planerad uppföljning av Lumeon API-användning och kostnad. |

*Fullständigt riskregister: [risk-register.md](risk-register.md).*

---

## 6. Verifiering före CAB

| Verifiering | Syfte | Ansvarig | Status |
|-------------|-------|----------|--------|
| Funktionstest av valda kanaler | Visa att medarbetaren kan nå NordIQ. | Karl Eek | Ej verifierat |
| Integration mot befintligt ärendehanteringssystem | Visa att eskaleringar kan registreras och följas upp. | Karl Eek / Anna Berg | Ej verifierat |
| Lumeon API som LLM-beroende | Visa att agentlagret kan anropa LLM API och hantera fel. | Karl Eek | Ej verifierat |
| CloudFrame-hosting | Visa att AI Agent Platform är nåbar och övervakningsbar. | Karl Eek | Ej verifierat |
| Last-/kapacitetskontroll | Visa att cirka 70 ärenden/dag och toppar kan hanteras. | Karl Eek | Planerad verifiering |
| Säkerhetsgranskning | Kontrollera att P1/P2, behörighet och personuppgifter inte hanteras fel. | Anna Berg / Karl Eek | Krävs före CAB |
| Rollback-genomgång | Visa att NordIQ kan pausas och manuell first line återupptas. | Anna Berg | Krävs före CAB |
| Pilot eller begränsad rollout | Mäta baseline för deflection, svarstid och eskaleringskvalitet. | Anna Berg | Planerad verifiering |

> Inga testresultat eller pilotvärden är etablerade i detta dokument. De ska fyllas i först när faktisk evidens finns.

---

## 7. Kommunikationsplan

| Aktivitet | Kanal | Ansvarig | Status |
|-----------|-------|----------|--------|
| Förhandsinformation till chefer | Mejl eller annat beslutat forum | Martin Lindqvist | Planerad |
| Information till alla medarbetare | Teams, intranät eller annan beslutad kanal | Anna Berg | Planerad |
| Kort användarguide / FAQ | Beslutat kunskapsbasverktyg | Karl Eek | Planerad |
| Go-live-meddelande | Beslutad kanal | Anna Berg | Beroende av CAB-beslut |
| Feedbackinsamling efter start | Teams, enkät eller ärendehanteringssystem | Anna Berg | Planerad |

---

## 8. Go/No-Go-kriterier

Alla nedanstående kriterier måste vara uppfyllda eller uttryckligen riskaccepterade av CAB.

| Kriterium | Godkänns av | Status |
|-----------|-------------|--------|
| SLO-baslinjer mätta i test-/pilotmiljö | Anna Berg | Ej verifierat |
| Rollback-plan dokumenterad och genomgången | Anna Berg | Krävs före CAB |
| CloudFrame- och Lumeon-constraints granskade mot faktisk SLA | Erik Holm / Anna Berg | Ej verifierat |
| Driftövertagande accepterat av Anna Berg | Anna Berg | Ej verifierat |
| Kommunikationsplan färdig | Anna Berg | Ej verifierat |
| On-call-schema klart för hypercare | Anna Berg | Ej verifierat |
| CAB formellt godkänner denna RFC | Martin Lindqvist / CAB | Ej beslutat |

---

## 9. Rollback-plan

**Trigger för rollback:** Ett eller flera av följande inträffar under go-live eller hypercare:

- P1-incident som inte kan begränsas inom beslutad tidsram.
- P1/P2-ärenden fastnar hos agenten.
- Deflection eller svarskvalitet indikerar fundamentalt fel.
- Säkerhetsincident eller risk för felaktig hantering av personuppgifter.
- CloudFrame eller Lumeon API har störning som gör NordIQ otillförlitligt.

**Rollback-steg:**

1. Anna Berg fattar rollback-beslut och informerar Karl Eek.
2. NordIQ-agentförmågan pausas eller döljs från valda kanaler.
3. Medarbetare dirigeras tillbaka till manuell first line.
4. Nya och pågående ärenden hanteras i befintligt ärendehanteringssystem.
5. Lumeon API-anrop stoppas eller begränsas om LLM-lagret är orsak eller risk.
6. Root cause-analys startar.
7. Martin Lindqvist informeras enligt eskaleringsplan.

**Estimerad tid för rollback:** Antagande: 15-30 minuter, måste verifieras.  
**Testad:** Nej - krävs före CAB.

*Se fullständig rollback-planmall: [templates/rollback-plan-template.md](../templates/rollback-plan-template.md).*

---

## 10. Hypercare

**Period:** Antagande: vecka 1-4 post go-live  
**Ansvarig:** Anna Berg

| Aktivitet | Frekvens | Ansvarig |
|-----------|----------|----------|
| SLO-granskning | Dagligen under första perioden | Anna Berg |
| On-call bemanning | Enligt beslutad hypercare-plan | Anna Berg + Karl Eek |
| Incident- och deflection-genomgång | Veckovis | Anna Berg + Karl Eek |
| Kommunikation till medarbetare | Vid behov | Anna Berg |
| Eskalering till Martin Lindqvist | Vid P1 eller trendavvikelse | Anna Berg |

**Hypercare avslutas när:** Antagande: SLO:er och eskaleringar är stabila under beslutad period.

---

## 11. CAB-beslut

| Beslut | Status | Anteckningar |
|--------|--------|--------------|
| Go-live godkänns | Ej beslutat | |
| Go-live godkänns med villkor | Rekommenderad beslutsform | Villkor ska listas av CAB. |
| Go-live avslås eller skjuts upp | Ej beslutat | Orsak och ny verifieringsplan krävs. |

> **Preliminär rekommendation:** Go-live med villkor, endast om go/no-go-kriterierna verifieras före produktionssättning.
