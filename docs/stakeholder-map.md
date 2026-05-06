# Intressentkarta - NordIQ

> **Dokumenttyp:** Stakeholder Map  
> **Ägare:** Anna Berg  
> **Version:** 1.0  
> **Status:** Utkast baserat på skolmaterialet

---

## Intressenttabell

| Stakeholder | Roll | Vad de vill | Vad de oroar sig för | Hur vi hanterar det |
|-------------|------|-------------|----------------------|---------------------|
| **Medarbetare** (~450) | Primär konsument av NordIQ | Snabb, begriplig hjälp utan att veta rätt supportväg; support även utanför kontorstid. | Att AI:n ger fel svar eller gör det svårare att nå människa. | Tydlig eskalering till människa, begränsat go-live-scope och uppföljning av feedback. |
| **First line support** (4 personer) | Påverkad intern grupp | Mindre repetitivt FAQ-inflöde och tydligare eskaleringar. | Att rollen förändras utan tydligt ansvar, eller att second line får sämre underlag. | Involvera first line i request models; mät eskaleringskvalitet; tydliggör att rollen förändras, inte försvinner. |
| **Second line / specialister** | Löser komplexa ärenden | Välstrukturerade ärenden med kategori, prioritet och kontext. | Dåliga eskaleringar och otydliga prioriteringar. | SLO för eskaleringskvalitet och stickprov i befintligt ärendehanteringssystem. |
| **Anna Berg** | IT Ops Lead; driftmottagare | Tydlig driftmodell, SLO:er, runbook och mandat för incident/rollback. | Att ta över en tjänst utan tillräckligt verifierad driftberedskap. | Handover som go-live-villkor; öppna risker och leverantörsvägar dokumenteras. |
| **Karl Eek** | Internal Dev Lead; plattformsansvarig | Få AI Agent Platform redo för drift och mätning. | Att leverantörsberoenden eller driftkrav bromsar plattformen sent. | Översätt SLO:er till tekniska krav och tydliggör vad som är driftconstraint. |
| **Martin Lindqvist** | CIO; beställare och go-live-beslutsägare | Board-ready story, kontrollerad risk och tydligt CAB-underlag. | Att go-live sker för tidigt eller blir politiskt synligt misslyckande. | Executive summary, go/no-go-kriterier och riskregister utan falsk evidens. |
| **Erik Holm** | CFO; äger leverantörsavtal | Förutsägbar run-rate, tokenkostnad och leverantörsrisk. | Tokenkostnader, dolda leverantörsbegränsningar och oklara supplier constraints. | Lumeon API-användning och leverantörs-SLA granskas före CAB; inga kostnadslarm antas vara på plats utan verifiering. |
| **Lina Nordin** | Head of HR; tung användare av first-line support | Nyanställda ska få snabbare svar på återkommande onboardingfrågor. | Att nya medarbetare får fel information eller fastnar i supportflödet. | Planerad sakgranskning för onboarding-scope innan det släpps brett. |
| **CloudFrame Nordic** | Extern leverantör - hostingplattform för AI Agent Platform | Stabil hosting och tydlig supportväg. | Otydliga krav eller felaktiga förväntningar på SLA. | Faktisk SLA och supportväg måste granskas som go-live-constraint. |
| **Lumeon API** | Extern leverantör - LLM API för agentlagret | Stabil LLM API-tjänst och förutsägbar tokenförbrukning. | Onormal belastning, latens eller kostnadsökning. | Följ LLM API-tillgänglighet, latens och tokenkostnad; operativ eskalering ligger i separat system enligt dokumenten. |
| **Befintligt ärendehanteringssystem** | Systemberoende för eskalering och uppföljning | Ärenden ska kunna registreras, routas och följas upp. | Om detta flöde brister tappar NordIQ spårbarhet och second line får sämre underlag. | Behandlas som eget beroende eftersom skolmaterialet inte namnger systemet. |
| **CAB** | Godkänner change/RFC | Välunderbyggt beslutsunderlag utan överraskningar. | Otillräcklig testning, otydliga risker och otydligt ansvar post go-live. | RFC med verifieringsstatus, go/no-go-kriterier och rollback-villkor. |

---

## Prioriteringsmatris

```text
INFLYTANDE
   Högt │  Martin L.  │  CAB / Anna B. │
        │  Erik H.    │  Karl E.       │
   Lågt │  Lina N.    │  Medarbetare   │
        │  Leverant.  │  First/Second  │
        └─────────────┴────────────────┘
              Lågt          Högt     INTRESSE/PÅVERKAN
```

**Strategi:**
- **Högt inflytande + högt intresse:** Nära dialog och tydliga beslutspunkter (Martin, CAB, Anna, Karl).
- **Högt inflytande + lägre daglig påverkan:** Informera utan att överbelasta (Erik).
- **Lägre inflytande + hög påverkan:** Involvera i pilot, sakgranskning och feedback (medarbetare, first line, second line, Lina).
- **Leverantörer:** Hantera via faktiska SLA:er, supportvägar och constraints.
