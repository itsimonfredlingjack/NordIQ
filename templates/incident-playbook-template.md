# Incident Playbook – [Tjänst/Komponent]

> **Mall för:** Major Incident Management  
> **Kopiera och anpassa per tjänst eller incidenttyp**

---

## Metadata

| Fält | Värde |
|------|-------|
| Tjänst | [Tjänstnamn] |
| Incidenttyp | [t.ex. Plattformsavbrott / API-fel] |
| Ägare | [Incident Manager – namn] |
| Version | 1.0 |
| Senast uppdaterad | [YYYY-MM-DD] |

---

## Incidentnivåer

| Prioritet | Definition | Responstid |
|-----------|-----------|------------|
| P1 – Kritisk | Tjänsten helt nere eller säkerhetsincident | < 5 min |
| P2 – Hög | Allvarlig störning, ≥ 10 % av användare påverkade | < 30 min |
| P3 – Medel | Begränsad störning, workaround finns | < 4 timmar |
| P4 – Låg | Kosmetisk eller icke-kritisk | < 2 arbetsdagar |

---

## Trigger

> [Beskriv vad som utlöser detta playbook – automatisk larm, rapport från användare, osv.]

---

## Steg-för-steg

| Steg | Åtgärd | Ansvarig | Tid |
|------|--------|----------|-----|
| 1 | Bekräfta incident och skapa ticket | [Namn/Roll] | < [X] min |
| 2 | Notifiera [personer] | [Namn/Roll] | Omedelbart |
| 3 | Aktivera fallback / begränsa påverkan | [Namn/Roll] | < [X] min |
| 4 | Identifiera preliminary root cause | [Namn/Roll] | < [X] min |
| 5 | Kommunicera status till användare | [Namn/Roll] | < [X] min |
| 6 | Eskalera till leverantör vid behov | [Namn/Roll] | < [X] min |
| 7 | Lösa eller begränsa till workaround | [Namn/Roll] | Varierar |
| 8 | Bekräfta lösning och stäng incident | [Namn/Roll] | – |
| 9 | Post-incident review | [Namn/Roll] | < 48 h |

---

## Eskaleringskedja

```
On-call (first responder)
    ↓
[Tjänsteägare – namn]
    ↓
[Leverantör – om tillämpligt]
    ↓
[CIO / Sponsor – vid P1 som ej löses inom 1 h]
```

---

## Kommunikationsmallar

**Statusuppdatering till användare (Teams/mejl):**
> "Vi är medvetna om ett problem med [tjänst]. Vårt team undersöker saken. Uppdatering kommer om [X] minuter. Workaround: [beskriv]."

**Eskalering till leverantör:**
> "Vi rapporterar ett P1-incident kopplat till [komponent]. Incident-ID: [ID]. Påverkan: [beskriv]. Vi behöver svar inom 30 minuter."

---

## Post-Incident Review (PIR)

**Ska hållas inom 48 h efter P1/P2.**

| Punkt | Beskrivning |
|-------|-------------|
| Vad hände? | [Tidslinje] |
| Root cause | [Identifierad / Under utredning] |
| Påverkan | [Antal användare, tid] |
| Åtgärder | [Kortsiktiga och långsiktiga] |
| Uppdateringar | [Kunskapsbas, risk-register, playbook] |
