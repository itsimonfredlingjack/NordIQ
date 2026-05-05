# Intressentkarta – NordIQ

> **Dokumenttyp:** Stakeholder Map  
> **Ägare:** Anna Berg  
> **Version:** 1.0

---

## Intressenttabell

| Stakeholder | Roll | Vad de vill | Vad de oroar sig för | Hur vi hanterar det |
|-------------|------|------------|----------------------|---------------------|
| **Medarbetare** (~450) | Primär konsument av NordIQ | Snabb, korrekt hjälp utan att veta rätt supportväg; tillgänglighet utanför kontorstid | Att AI:n ger fel svar; att det är krångligare än att ringa direkt | Enkel onboarding-guide; tydlig feedbackknapp; mänsklig eskalering alltid möjlig |
| **First line support** (~5) | Mottar eskalerade ärenden från NordIQ | Tydliga, kompletta tickets; minskad volym av triviala frågor | Att jobbet försvinner; att de får sämre ärenden med mer komplex info att hantera | Involvera first line i utformning av eskaleringstruktur; tydliggör att rollen förändras, inte försvinner |
| **Second line / Dev** (~10) | Löser komplexa ärenden; tar emot eskaleringar | Välstrukturerade tickets med rätt info; förutsägbar belastning | Dåliga eskaleringar ökar merarbete; otydliga prioriteringar | SLO för eskaleringskvalitet; veckovis stickprov; feedback-loop till Karl Eek |
| **Anna Berg** | IT Ops Lead; driftansvarig NordIQ | Tydlig driftmodell; fungerade SLO:er; support från ledning | Att hon inte har mandat eller resurser att åtgärda problem; att rollback krävs utan förvarning | Formell handover; tydliga ansvarsområden; direktlinje till Martin Lindqvist vid P1 |
| **Karl Eek** | Dev Lead; plattformsansvarig | Tekniskt stabil plattform; tydliga krav; rimliga SLO:er | Leverantörsberoenden (CloudFrame, Lumeon) utanför hans kontroll; framtida krav utan resursökning | Leverantörs-SLA:er dokumenterade; öppna risker i riskregistret; CI-register för framtida krav |
| **Martin Lindqvist** | CIO; sponsor och CAB-ordförande | Affärsvärde levereras; kostnader under kontroll; inga pinsamma incidenter | Att go-live är för tidigt; att tjänsten skadar NordTechs rykte internt | Executive summary med tydlig go/no-go-struktur; villkorat godkännande; hypercare-plan |
| **Erik Holm** | CFO | Kostnadskontroll; tydlig ROI; inga överraskningar | Tokenkostnader skenar; investering levererar inte deflection; dolda leverantörskostnader | SLO för deflection rate; kostnadslarm i CloudFrame; kvartalsmöte med Anna Berg och Karl Eek |
| **Lina Nordin** | Head of HR | Smidig onboarding-upplevelse för nya medarbetare; korrekt HR-information | Att NordIQ ger fel information om HR-processer; att nya medarbetare har dålig upplevelse | Lina involverad i UAT för onboarding-flödet; dedikerat onboarding-FAQ-paket; Lina äger CI-01 |
| **Lumeon API** | Leverantör – LLM-leverantör (AI-API) | Korrekt API-användning; stabil integration | Onormal belastning; felaktig implementering som ger supportbörda | Integrationsdokumentation upprätthålls av Karl Eek; SLA-krav dokumenterade; fallback-plan vid avbrott |
| **CloudFrame Nordic** | Leverantör – drift och hosting | Stabil drift; tydliga krav; rimlig felanmälningsprocess | Otydliga SLA-krav; fler kunder med konfliktande prioriteringar | SLA-avtal med P1-kommunikation inom 30 min; status i SLO-uppföljning; kontaktperson dokumenterad |
| **CAB** | Change Advisory Board; godkänner RFC | Välunderbyggt beslutsunderlag; inga obehagliga överraskningar; tydlig rollback-plan | Otillräcklig testning; otydliga risker; otydligt ansvar post go-live | Fullständigt RFC-dokument med go/no-go-kriterier; testbevis; villkorad rekommendation |

---

## Prioriteringsmatris

```
INFLYTANDE
   Högt │  Martin L.  │  CAB        │
        │  Erik H.    │  Anna B.    │
   Lågt │  Lina N.    │  Medarbetare│
        │  CloudFrame │  Second line│
        └─────────────┴─────────────┘
              Lågt          Högt     INTRESSE/PÅVERKAN
```

**Strategi:**
- **Högt inflytande + högt intresse:** Nära dialog; inkludera i beslut (Martin, CAB, Anna)
- **Högt inflytande + lågt intresse:** Informera regelbundet; undvik överraskningar (Erik)
- **Lågt inflytande + högt intresse:** Involvera i pilottest och feedback (medarbetare, second line)
- **Leverantörer:** Hantera via SLA och formell kontakt
