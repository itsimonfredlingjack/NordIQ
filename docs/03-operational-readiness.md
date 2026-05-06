# Operational Readiness - NordIQ

> **Dokumenttyp:** Driftunderlag  
> **Ägare:** Anna Berg  
> **Teknisk kontakt:** Karl Eek  
> **Version:** 1.0  
> **Status:** Utkast - arbetssätt och kontakter behöver verifieras före go-live

---

## 1. Service Request Flow

```text
Medarbetare
    |
    v
[Teams / mejl / webbportal]
    |
    v
NordIQ (AI-agent)
    |--> Direkt svar (kunskapsbas / FAQ)
    |       `--> Ärendet avslutas eller feedback samlas
    |
    |--> Strukturerad ticket skapas i befintligt ärendehanteringssystem
    |       `--> Second line / rätt grupp
    |              `--> Lösning bekräftad
    |                     `--> Kunskapsbas och CI-register uppdateras vid behov
    |
    `--> P1/P2 eller osäkert ärende detekteras
            `--> Omedelbar eskalering till människa enligt on-call-väg
```

**Nyckelprinciper:**
- NordIQ stänger aldrig ett P1/P2-ärende utan mänsklig bekräftelse.
- Ärenden som inte löses direkt ska kunna följas i befintligt ärendehanteringssystem.
- Kunskapsluckor och felklassificeringar ska bli input till Continual Improvement.
- Lumeon API används som LLM API för agentlagret. Operativ eskalering sker i separat befintligt system.

---

## 2. Incidentnivåer (P1-P4)

| Prioritet | Definition | Exempel | Föreslagen responstid | Eskaleras till |
|-----------|------------|---------|-----------------------|----------------|
| **P1 - Kritisk** | NordIQ eller kritiskt supportflöde är nere, eller säkerhetsincident misstänks. | CloudFrame-hostad plattform nere; kritisk data exponerad. | Omedelbart. Exakt minutkrav behöver beslutas. | Anna Berg + Karl Eek + Martin Lindqvist |
| **P2 - Hög** | Allvarlig störning som påverkar många användare eller gör agenten otillförlitlig. | Lumeon API instabilt; P1/P2-klassificering fungerar inte; deflection faller kraftigt. | Inom definierad on-call-rutin. | Anna Berg + Karl Eek |
| **P3 - Medel** | Begränsad störning med workaround. | En kanal nere; felrouting av enstaka ärendetyper. | Inom arbetsdag eller enligt SLO. | On-call / second line |
| **P4 - Låg** | Mindre fel utan omedelbar driftpåverkan. | Felaktig eller inaktuell kunskapsbasartikel. | Backlog / CI-register. | Karl Eek eller utsedd kunskapsägare |

### Vad ska alltid eskaleras till människa

- Misstänkt säkerhetsincident eller dataläckage.
- Ärenden som rör personuppgifter eller behörigheter.
- Alla P1/P2 utan undantag.
- Ärenden där medarbetaren explicit ber om mänsklig kontakt.
- Ärenden där agenten är osäker eller ger inkonsekvent klassificering.

---

## 3. Major Incident Playbook (förenklad)

**Trigger:** P1-incident detekteras automatiskt eller rapporteras av medarbetare, first line eller second line.

| Steg | Åtgärd | Ansvarig | Status |
|------|--------|----------|--------|
| 1 | Bekräfta incident och skapa P1-ärende i befintligt ärendehanteringssystem. | On-call / first responder | Planerad rutin |
| 2 | Notifiera Anna Berg och Karl Eek via beslutad kanal. | On-call / automatisk larmning om sådan finns | Planerad verifiering |
| 3 | Aktivera fallback till manuell first line vid behov. | Anna Berg | Go-live-förutsättning |
| 4 | Identifiera preliminär root cause: CloudFrame, Lumeon API, agentlogik, kunskapsbas eller internt flöde. | Karl Eek | Planerad rutin |
| 5 | Kommunicera status till medarbetare via beslutad kanal. | Anna Berg | Planerad rutin |
| 6 | Eskalera till CloudFrame eller Lumeon API när leverantörsberoende misstänks. | Karl Eek / Erik Holm beroende på kontraktsväg | Planerad verifiering |
| 7 | Begränsa påverkan eller stäng av NordIQ-agentförmåga tillfälligt. | Anna Berg + Karl Eek | Go-live-förutsättning |
| 8 | Håll post-incident review efter P1/P2. | Anna Berg | Planerad rutin |
| 9 | Uppdatera kunskapsbas, riskregister och CI-register. | Karl Eek / utsedd ägare | Planerad rutin |

*Se fullständig spelboksmall: [templates/incident-playbook-template.md](../templates/incident-playbook-template.md).*

---

## 4. Problem Management

**Ansvarig:** Anna Berg, med tekniskt stöd från Karl Eek.

- Alla P1/P2 bör utredas för underliggande orsak.
- Återkommande P3-mönster bör eskaleras till problem management.
- Problemärenden ska hanteras i befintligt ärendehanteringssystem eller annat beslutat problemverktyg.
- Known errors och workarounds ska dokumenteras i kunskapsbasen.

**Antagande:** Problem management används i enkel form under första perioden. Fullt processtöd är inte etablerat i skolmaterialet och ska inte beskrivas som infört.

---

## 5. Continual Improvement

- Månadsvis CI-möte föreslås ledas av Anna Berg.
- Input: SLO-rapport, användarfeedback, incidentlogg, eskaleringsdata och kunskapsbasluckor.
- Output: Uppdaterat [ci-register.md](ci-register.md).
- Prioritering bör göras mot affärsvärde, risk och resurskapacitet.
- Resultat kan rapporteras till Martin Lindqvist kvartalsvis efter go-live.

---

## 6. On-Call & Eskalering

| Roll | Person | Kontakt | Tillgänglighet |
|------|--------|---------|----------------|
| IT Ops Lead (primär) | Anna Berg | Ej verifierad | Behöver beslutas före go-live |
| Dev Lead (tech) | Karl Eek | Ej verifierad | Behöver beslutas före go-live |
| CloudFrame support | Ej verifierad | Ej verifierad | Enligt faktiskt CloudFrame-avtal |
| Lumeon API support | Ej verifierad | Ej verifierad | Enligt faktiskt Lumeon-avtal |
| CIO (eskaleringsslut) | Martin Lindqvist | Via Anna Berg | Vid P1 eller större riskbeslut |

*Se eskaleringsdiagram: [diagrams/escalation-map.mmd](../diagrams/escalation-map.mmd).*

---

## 7. Handover till Anna Berg

Anna Berg kan ta över driftansvar först när följande är verifierat:

- [ ] Tillgång till CloudFrame-status, avtalad supportväg och relevant driftinformation.
- [ ] Tillgång till Lumeon API-status/usage-rapportering om sådan finns.
- [ ] Tillgång till befintligt ärendehanteringssystem och relevanta rapporter.
- [ ] Dokumentation av eskaleringsvägar och on-call-schema.
- [ ] Genomgång av kända svagheter och öppna risker (se [risk-register.md](risk-register.md)).
- [ ] Driftövertagande granskat och accepterat som go-live-förutsättning.
- [ ] Första CI-möte planerat efter go-live.

**Antagande:** Formellt handover bör ske före go-live så att Anna Berg hinner validera miljö, leverantörsvägar och fallback.
