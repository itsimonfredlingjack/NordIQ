# Riskregister - NordIQ

> **Dokumenttyp:** Riskregister  
> **Ägare:** Anna Berg  
> **Senast uppdaterad:** Ej satt  
> **Version:** 1.0  
> **Status:** Utkast - risker och kontroller behöver verifieras före CAB

---

**Skala:**  
- Sannolikhet: Låg / Medel / Hög  
- Påverkan: Låg / Medel / Hög / Kritisk  
- Status: Öppen / Pågår / Stängd / Accepterad

---

## Riskregister

| ID | Risk | Orsak | Konsekvens | Sannolikhet | Påverkan | Föreslagen åtgärd | Ägare | Status |
|----|------|-------|------------|-------------|----------|-------------------|-------|--------|
| R-01 | Lumeon API nere eller instabilt | Leverantörsstörning, latens eller API-förändring i LLM-lagret | NordIQ kan inte ge tillförlitliga AI-svar; agentförmågan kan behöva pausas | Medel | Hög | Planera fallback där medarbetare går till manuell first line och registrering sker i separat befintligt system | Anna Berg / Karl Eek | Öppen |
| R-02 | CloudFrame driftstörning | Hostingproblem för AI Agent Platform | NordIQ blir helt eller delvis otillgänglig | Låg/Medel | Kritisk | Planera on-call, intern kommunikation och leverantörseskalering enligt faktisk CloudFrame-SLA | Anna Berg | Öppen |
| R-03 | AI ger felaktigt svar | Luckor i kunskapsbas, otydlig fråga eller icke-deterministiskt LLM-beteende | Medarbetare agerar på fel information; förtroendeförlust | Medel | Medel/Hög | Begränsa direktsvar till kunskapsgrundade FAQ-mönster; eskalera osäkra svar; logga kunskapsluckor i CI-register | Karl Eek | Öppen |
| R-04 | P1/P2 fastnar hos agenten | Felaktig prioritetsklassificering eller saknad human-in-the-loop-regel | Kritisk incident hanteras inte i tid | Låg | Kritisk | Go/no-go-krav: P1/P2 ska alltid eskaleras till människa och verifieras före CAB | Anna Berg | Öppen |
| R-05 | Second line får dåliga eskaleringar | Otydlig request model eller ofullständig ärendestruktur | Merarbete för second line och längre resolution | Medel | Medel | SLO på eskaleringskvalitet; stickprov i befintligt ärendehanteringssystem under pilot/begränsad rollout | Karl Eek | Öppen |
| R-06 | Tokenkostnad ökar oväntat | Hög volym, komplexa frågor eller ineffektiv användning av Lumeon API | Run-rate blir svår att förutse för Erik Holm | Medel | Medel | Planerad uppföljning av Lumeon API-användning och kostnad; kostnadslarm är ett antagande tills rapportering är verifierad | Karl Eek / Erik Holm | Öppen |
| R-07 | Kunskapsbas blir gammal | Otydligt ägarskap eller saknad reviewrutin | Felaktiga svar, sjunkande deflection och förtroendeförlust | Hög | Medel | Go/no-go-krav: artiklar i go-live-scope ska ha ägare och reviewdatum | Karl Eek | Öppen |
| R-08 | HR-onboarding påverkas negativt | NordIQ ger fel svar eller saknar korrekt onboardingkunskap | Dålig upplevelse för nya medarbetare och ökad belastning på HR | Låg/Medel | Medel | Planerad sakgranskning med Lina Nordin innan onboardingfrågor släpps i scope | Lina Nordin / Karl Eek | Öppen |
| R-09 | Låg adoption bland medarbetare | Okännedom, låg tillit eller snabbare bypass via direktkontakt med IT | Investeringen ger inte förväntad deflection | Medel | Medel | Kommunikationsplan, enkel mänsklig eskalering och uppföljning av användarfeedback | Anna Berg | Öppen |
| R-10 | Säkerhets- eller personuppgiftsrisk via AI-kanalen | Felaktig åtkomstkontroll, prompt injection eller känslig data i dialog | Regelefterlevnadsrisk och förtroendeskada | Låg | Kritisk | Säkerhetsgranskning krävs före CAB; inga pen-test- eller autentiseringskontroller är verifierade i detta underlag | Karl Eek / Anna Berg | Öppen |

---

## Riskmatris (översikt)

```text
PÅVERKAN
Kritisk │  R-02  │        │  R-04  │  R-10  │
   Hög  │        │  R-01  │        │        │
  Medel │        │  R-05  │  R-03  │  R-06  │  R-07
   Låg  │        │  R-08  │  R-09  │        │
        └────────┴────────┴────────┴────────┘
               Låg      Medel     Hög    SANNOLIKHET
```

---

## Granskningsintervall

- **Före CAB:** Genomgång av öppna P1/P2-, leverantörs- och säkerhetsrisker.
- **Hypercare (om go-live godkänns):** Veckovis genomgång av Anna Berg.
- **Stabilisering:** Månadsvis genomgång när tjänsten är i drift.
- **Business as usual:** Kvartalsvis eller vid större incident/förändring.
