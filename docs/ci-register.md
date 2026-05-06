# Continual Improvement Register - NordIQ

> **Dokumenttyp:** CI-register  
> **Ägare:** Anna Berg  
> **Senast uppdaterad:** Ej satt  
> **Version:** 1.0  
> **Status:** Utkast - inga förbättringar är verifierat genomförda

---

**Prioritetsskala:** Hög / Medel / Låg  
**Status:** Identifierad / Planerad / Pågår / Klar / Avvisad

---

## CI-register

| ID | Förbättring | Källa | Förväntad effekt | Ägare | Prioritet | Status |
|----|-------------|-------|------------------|-------|-----------|--------|
| CI-01 | Förbättra onboarding-svar i kunskapsbasen | Planerad sakgranskning med Lina Nordin och framtida pilotfeedback | Fler nya medarbetare får direktsvar utan att HR belastas | Lina Nordin + Karl Eek | Hög | Planerad |
| CI-02 | Minska felaktiga eskaleringar till second line | Planerad SLO-mätning av eskaleringskvalitet | Kortare lösningstid och mindre merarbete för second line | Karl Eek | Hög | Identifierad |
| CI-03 | Införa regelbunden review av kunskapsbas | Risk R-07 och SLO för kunskapsbasaktualitet | Aktuella artiklar, färre felaktiga svar och bättre deflection | Karl Eek | Hög | Planerad |
| CI-04 | Följa och optimera LLM-/tokenkostnad | Lumeon API är token-prissatt enligt caset | Bättre kostnadskontroll för Erik Holm | Karl Eek + Erik Holm | Medel | Identifierad |
| CI-05 | Mäta användarnöjdhet efter avslutat ärende | Saknas i v0; behövs för adoption och förbättring | Bättre förståelse för användarupplevelse | Anna Berg | Medel | Identifierad |
| CI-06 | Automatisera påminnelse för kunskapsbasreview | Antagande: manuell review riskerar att glömmas bort | Stöd för SLO kring kunskapsbasaktualitet | Karl Eek | Medel | Planerad |
| CI-07 | Utvärdera utökning till fler kanaler | Framtida medarbetarfeedback | Ökad tillgänglighet om grundflödet fungerar | Anna Berg + Karl Eek | Låg | Identifierad |
| CI-08 | Förbättra klassificering av P3-ärenden | Framtida incidentanalys under hypercare | Färre felroutade ärenden | Karl Eek | Medel | Identifierad |
| CI-09 | Strukturera problem management-process | ITIL-practice och återkommande incidentmönster | Bättre root-cause-analys och färre återkommande incidenter | Anna Berg | Låg | Identifierad |
| CI-10 | Definiera SLO-rapportering | Manuell rapportering är ett antagande och behöver ersättas av beslutad rutin | Snabbare reaktion vid SLO-avvikelse och bättre CAB-underlag | Karl Eek | Medel | Identifierad |

---

## CI-process

```text
Input (incidenter, feedback, SLO-avvikelser)
    |
    v
Identifieras och loggas i detta register
    |
    v
Prioriteras vid månadsmöte (Anna Berg)
    |
    v
Planeras och tilldelas ägare
    |
    v
Implementeras och verifieras
    |
    v
Stängs med dokumenterat resultat
    |
    v
Kommuniceras till Martin Lindqvist (kvartalsvis)
```

---

## Nästa CI-möte

**Tidpunkt:** Efter eventuell go-live eller begränsad rollout.  
**Deltagare:** Anna Berg, Karl Eek och berörda ägare.  
**Agenda:** Genomgång av hypercare-data, pilotfeedback om sådan finns, SLO-avvikelser och prioritering av CI-01 till CI-05.
