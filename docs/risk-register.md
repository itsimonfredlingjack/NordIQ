# Riskregister – NordIQ

> **Dokumenttyp:** Riskregister  
> **Ägare:** Anna Berg  
> **Senast uppdaterad:** [YYYY-MM-DD]  
> **Version:** 1.0

---

**Skala:**  
- Sannolikhet: Låg / Medel / Hög  
- Påverkan: Låg / Medel / Hög / Kritisk  
- Status: Öppen / Pågår / Stängd / Accepterad

---

## Riskregister

| ID | Risk | Orsak | Konsekvens | Sannolikhet | Påverkan | Åtgärd | Ägare | Status |
|----|------|-------|------------|-------------|----------|--------|-------|--------|
| R-01 | Lumeon API nere | Leverantörsdriftstörning eller API-förändring utan förvarning | NordIQ kan inte logga eller routa ärenden; eskalering bryts | Medel | Hög | Fallback-procedur till manuell first line aktiveras automatiskt; SLA-krav på 30-min-kommunikation vid P1 | Anna Berg | Öppen |
| R-02 | CloudFrame driftstörning | Infrastrukturproblem hos leverantören | NordIQ AI-motor svarar inte; hela tjänsten otillgänglig | Låg | Kritisk | On-call-plan aktiveras; kommunikation till medarbetare via Teams; eskaleras till CloudFrame P1-support | Anna Berg | Öppen |
| R-03 | AI ger felaktigt svar | Luckor i kunskapsbas, otydlig fråga, hallucination | Medarbetare agerar på fel information; förtroendeförlust | Medel | Medel | Human-in-the-loop för P1/P2; feedback-knapp i varje svar; kvartalsvis kunskapsbasreview | Karl Eek | Öppen |
| R-04 | P1-incident fastnar hos agenten | Felaktig prioritetsklassificering av AI | Kritisk incident hanteras inte i tid; SLA bryts | Låg | Kritisk | Automatisk eskalering efter 60 s om ingen mänsklig bekräftelse; alltid human-in-the-loop för P1/P2 | Anna Berg | Öppen |
| R-05 | Second line får dåliga eskaleringar | Otydlig ticket-struktur; bristande kunskapsbas | Merarbete för second line; ärenden löses långsammare | Medel | Medel | SLO på eskaleringskvalitet (90 % kompletta); stickprov veckovis under hypercare | Karl Eek | Öppen |
| R-06 | Tokenkostnad ökar oväntat | Hög volym komplexa frågor; ineffektiv prompt-design | Budgetöverskridande; kan kräva prioriteringsomtag | Medel | Medel | Kostnadslarm satt i CloudFrame-dashboard; granskas vecka 2 post go-live; budget-review med Erik Holm | Karl Eek | Öppen |
| R-07 | Kunskapsbas blir gammal | Ingen tydlig ägarstruktur eller reviewrutin | Felaktiga svar; sjunkande deflection rate; förtroendeförlust | Hög | Medel | SLO: 100 % av artiklar har ägare + reviewdatum; automatisk påminnelse varje kvartal | Karl Eek | Öppen |
| R-08 | HR-onboarding påverkas negativt | NordIQ-fel under onboarding-period för nya medarbetare | Dålig första upplevelse; ökad belastning på Lina Nordins team | Låg | Medel | Onboarding-flöde testas separat; Lina Nordin är med i UAT; dedikerat onboarding-FAQ-paket | Lina Nordin | Öppen |
| R-09 | Låg adoption bland medarbetare | Okännedom om tjänsten; gamla vanor (ringa first line direkt) | Investering levererar inte förväntat värde; deflection rate låg | Medel | Medel | Kommunikationskampanj; ambassadörsprogram; enkel onboarding-guide | Anna Berg | Öppen |
| R-10 | Säkerhetsincident via AI-kanalen | Prompt injection eller felaktig åtkomstkontroll | PII-exponering; regelefterlevnadsbrott (GDPR) | Låg | Kritisk | Pen-test genomfört; Azure AD-autentisering; ingen PII lagras i AI-kontext; incidentplan för dataintrång | Karl Eek | Öppen |

---

## Riskmatris (översikt)

```
PÅVERKAN
Kritisk │  R-02  │        │  R-04  │  R-10  │
   Hög  │        │  R-01  │        │        │
  Medel │        │  R-05  │  R-03  │  R-06  │  R-07
   Låg  │  R-08  │  R-09  │        │        │
        └────────┴────────┴────────┴────────┘
               Låg      Medel     Hög    SANNOLIKHET
```

---

## Granskningsintervall

- **Hypercare (vecka 1–4):** Veckovis genomgång av Anna Berg
- **Stabilisering (månad 2–3):** Månadsvis
- **Business as usual:** Kvartalsvis eller vid ny incident/förändring
