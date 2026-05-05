# Operational Readiness – NordIQ

> **Dokumenttyp:** Driftunderlag  
> **Ägare:** Anna Berg  
> **Teknisk kontakt:** Karl Eek  
> **Version:** 1.0

---

## 1. Service Request Flow

```
Medarbetare
    │
    ▼
[Teams / Mejl / Webbportal]
    │
    ▼
NordIQ (AI-agent)
    ├──→ Direkt svar (kunskapsbas, FAQ)
    │        └──→ Ärendet stängs + feedback samlas
    │
    ├──→ Strukturerad ticket skapas (via Lumeon)
    │        └──→ Second line / rätt grupp
    │                 └──→ Lösning bekräftad
    │                          └──→ Kunskapsbas uppdateras (CI)
    │
    └──→ P1/P2 detekteras
             └──→ Omedelbar eskalering till on-call (< 60 s)
```

**Nyckelprinciper:**
- NordIQ stänger aldrig ett P1/P2-ärende utan mänsklig bekräftelse
- Alla ärenden får ett Lumeon-ärendenummer oavsett kanal
- Kunskapsbasen uppdateras efter varje ny kategori av ärende som löses

---

## 2. Incidentnivåer (P1–P4)

| Prioritet | Definition | Exempel | Responstid | Eskaleras till |
|-----------|-----------|---------|------------|----------------|
| **P1 – Kritisk** | Tjänsten är helt nere eller kritisk data är exponerad | NordIQ svarar inte; autentisering bruten | Omedelbart (< 5 min) | Anna Berg + Karl Eek + Martin Lindqvist |
| **P2 – Hög** | Allvarlig störning som påverkar ≥ 10 % av användare | Deflection fungerar inte; Lumeon API ej tillgängligt | < 30 min | Anna Berg + Karl Eek |
| **P3 – Medel** | Begränsad störning; workaround finns | Enstaka kanal ner (t.ex. Teams-bot); felrouting | < 4 timmar | On-call second line |
| **P4 – Låg** | Kosmetisk eller icke-kritisk | Stavfel i svar; felaktig artikel i kunskapsbas | < 2 arbetsdagar | Karl Eek (backlog) |

### Vad ska alltid eskaleras till människa

- Säkerhetsincidenter (misstänkt intrång, dataläckage)
- Ärenden som rör personuppgifter eller GDPR
- Alla P1/P2 utan undantag
- Ärenden där medarbetaren explicit ber om mänsklig kontakt
- Ärenden med felaktig eller inkonsekvent AI-klassificering (flaggas automatiskt)

---

## 3. Major Incident Playbook (förenklad)

**Trigger:** P1-incident detekteras automatiskt ELLER rapporteras av medarbetare/second line.

| Steg | Åtgärd | Ansvarig | Tid |
|------|--------|----------|-----|
| 1 | Bekräfta incident och skapa P1-ticket i Lumeon | On-call | < 5 min |
| 2 | Notifiera Anna Berg och Karl Eek (SMS + Teams) | Automatisk | Omedelbart |
| 3 | Aktivera fallback (manuell first line) | Anna Berg | < 15 min |
| 4 | Identifiera root cause (preliminärt) | Karl Eek | < 30 min |
| 5 | Kommunicera status till medarbetare via Teams | Anna Berg | < 30 min |
| 6 | Eskalera till leverantör (CloudFrame/Lumeon) vid behov | Karl Eek | < 45 min |
| 7 | Lösa eller begränsa påverkan | Karl Eek + Leverantör | Varierar |
| 8 | Post-incident review inom 48 h | Anna Berg | < 48 h |
| 9 | Uppdatera kunskapsbas och risk-register | Karl Eek | < 5 dagar |

*Se fullständig spelbok: [templates/incident-playbook-template.md](../templates/incident-playbook-template.md)*

---

## 4. Problem Management

**Ansvarig:** Anna Berg (Problem Manager, delegerat till Karl Eek för tekniska problem)

- Alla P1/P2-incidenter utreds för underliggande orsak (Root Cause Analysis)
- Återkommande P3-incidenter (≥ 3 på 30 dagar) eskaleras till problem management
- Problem-tickets hanteras i Lumeon med länk till relaterade incidents
- Known errors dokumenteras i kunskapsbasen med workaround

**Antagande:** Problem management-processen används i begränsad form under de första 90 dagarna. Fullt processtöd från Lumeon aktiveras i fas 2.

---

## 5. Continual Improvement

- Månadsvis CI-möte leds av Anna Berg
- Input: SLO-rapport, användarfeedback, incidentlogg, eskaleringsdata
- Output: Uppdaterat [ci-register.md](ci-register.md)
- Prioritering görs mot affärsvärde och resurskapacitet
- Resultat kommuniceras till Martin Lindqvist kvartalsvis

---

## 6. On-Call & Eskalering

| Roll | Person | Kontakt | Tillgänglighet |
|------|--------|---------|----------------|
| IT Ops Lead (primär) | Anna Berg | [telefon] | Vardagar 08–18; on-call via SMS |
| Dev Lead (tech) | Karl Eek | [telefon] | Vardagar 08–18; on-call vid P1/P2 |
| CloudFrame support | [kontaktperson] | [support-mejl] | Enligt SLA (24/7 för P1) |
| Lumeon support | [kontaktperson] | [support-mejl] | Enligt SLA (24/7 för P1) |
| CIO (eskaleringsslut) | Martin Lindqvist | [telefon] | Vardagar; nås via Anna vid P1 |

*Se eskalerings­diagram: [diagrams/escalation-map.mmd](../diagrams/escalation-map.mmd)*

---

## 7. Handover till Anna Berg

Anna Berg tar över driftansvar för NordIQ från go-live-datum. Handover inkluderar:

- [ ] Tillgång till CloudFrame-dashboard och larmprofiler
- [ ] Tillgång till Lumeon-admin och rapportmiljö
- [ ] Dokumentation av eskaleringsvägar och on-call-schema
- [ ] Genomgång av kända svagheter och öppna risker (se [risk-register.md](risk-register.md))
- [ ] Signerat driftövertagandedokument
- [ ] Introduktion till CI-processen och första CI-möte bokat (datum + 30 dagar)

**Antagande:** Formellt handover sker minst 3 dagar före go-live för att Anna Berg ska ha tid att validera miljön.
