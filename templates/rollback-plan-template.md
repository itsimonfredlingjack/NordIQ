# Rollback-plan – [RFC-ID / Tjänst]

> **Mall för:** Rollback vid go-live eller förändring  
> **Kopiera och anpassa per RFC eller release**

---

## Metadata

| Fält | Värde |
|------|-------|
| RFC-ID | [RFC-XXXX] |
| Tjänst | [Tjänstnamn] |
| Rollback-ansvarig | [Namn] |
| Teknisk kontakt | [Namn] |
| Datum | [YYYY-MM-DD] |
| Testad | ☐ Ja / ☐ Nej |
| Testdatum | [YYYY-MM-DD] |

---

## Trigger-kriterier

Rollback aktiveras om ett eller flera av följande inträffar:

- [ ] [Trigger 1 – t.ex. P1-incident olöst efter X timmar]
- [ ] [Trigger 2 – t.ex. SLO underskrider X %]
- [ ] [Trigger 3 – t.ex. Säkerhetsincident]

**Beslutsfattare för rollback:** [Namn]  
**Konsulteras:** [Namn]

---

## Rollback-steg

| Steg | Åtgärd | Ansvarig | Estimerad tid |
|------|--------|----------|---------------|
| 1 | [t.ex. Inaktivera ny komponent] | [Namn] | [X min] |
| 2 | [t.ex. Återaktivera tidigare version/process] | [Namn] | [X min] |
| 3 | [t.ex. Kommunicera status till användare] | [Namn] | [X min] |
| 4 | [t.ex. Verifiera att gammal lösning fungerar] | [Namn] | [X min] |
| 5 | [t.ex. Rapportera till sponsor/CIO] | [Namn] | [X min] |

**Total estimerad tid:** [X–Y minuter]

---

## Kommunikation vid rollback

**Till medarbetare (Teams/mejl):**
> "[Tjänst] återgår tillfälligt till [tidigare lösning] på grund av [kort förklaring]. Support nås via [kanal]. Vi återkommer med uppdatering inom [X] timmar."

**Till sponsor/CIO:**
> "Rollback av [tjänst] har aktiverats [tid]. Orsak: [kort]. Root cause-analys startar omedelbart. Nästa uppdatering: [tid]."

---

## Verifiering efter rollback

- [ ] Gammal lösning/process fungerar korrekt
- [ ] Inga ärenden är i limbo (kontrollera ticket-system)
- [ ] Kommunikation skickad till alla berörda
- [ ] Root cause-analys startad
- [ ] Sponsor/CIO informerad

---

## Nästa steg efter rollback

1. Root cause-analys inom 48 h
2. Uppdatera risk-register
3. Sätt nytt go-live-datum om/när grundorsak är åtgärdad
4. Informera CAB om nytt go-live-datum
