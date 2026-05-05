# Service Levels & SLO:er – NordIQ

> **Dokumenttyp:** SLO-definition  
> **Ägare:** Anna Berg  
> **Granskad av:** Karl Eek  
> **Version:** 1.0

---

## SLO-tabell

| # | Område | SLO | Mätmetod | Varför det behövs | Ägare |
|---|--------|-----|----------|-------------------|-------|
| 1 | **Tillgänglighet** | 99,0 % per månad | Syntetic monitoring via CloudFrame dashboard | Grunden för att tjänsten ska leverera nytta. Avbrott påverkar alla 800 medarbetare | Anna Berg |
| 2 | **Första svar** | 95 % av förfrågningar besvaras inom 10 sekunder | Logganalys från Lumeon + CloudFrame | Medarbetarupplevelse – lång väntetid driver användare tillbaka till manuell first line | Karl Eek |
| 3 | **Deflection rate** | ≥ 40 % vid go-live; mål ≥ 60 % efter stabilisering (90 dagar) | (Ärenden lösta av NordIQ direkt) / (Totala inkommande ärenden) | Visar att AI:n levererar värde och avlastar first line | Anna Berg |
| 4 | **Eskaleringskvalitet** | 90 % av eskalerade tickets är kompletta (kategori, beskrivning, prioritet) | Manuell stickprov + automatisk fältvalidering i Lumeon | Dåliga eskaleringar skapar merarbete för second line och löser inte grundproblemet | Karl Eek |
| 5 | **Säker eskalering P1/P2** | 100 % av P1- och P2-ärenden eskaleras till människa | Incident-logg vs. AI-logg (delta = 0 accepteras inte) | P1/P2 är kritiska incidenter – AI-agenten får aldrig ensam hantera dessa | Anna Berg |
| 6 | **Kunskapsbasens aktualitet** | 100 % av artiklar har dokumenterad ägare och reviewdatum | Inventering i SharePoint (automatiserad påminnelse varje kvartal) | Gammal kunskapsbas ger felaktiga svar och urholkar förtroendet | Karl Eek |
| 7 | **Leverantörsstatus – CloudFrame** | Inga P1-incidenter utan kommunikation inom 30 min | Incidentlogg från CloudFrame Nordic | Plattformsberoende – driftstörning stoppar hela NordIQ | Anna Berg |
| 8 | **Leverantörsstatus – Lumeon** | Inga P1-incidenter utan kommunikation inom 30 min | Incidentlogg från Lumeon | Ärendeloggning och routing är beroende av Lumeon API | Anna Berg |

---

## SLO-anteckningar

> **Antagande:** Baseline för deflection rate och svarstid sätts under de första 5 dagarna i staging/pilotmiljö. Dessa värden justeras vid behov innan CAB-beslut.

> **Antagande:** 99,0 % tillgänglighet innebär att maximalt ~7 timmars oplanerat avbrott per månad är acceptabelt. Planerat underhåll räknas bort om det kommuniceras ≥ 48 h i förväg.

---

## Go/No-Go-kriterier baserade på SLO:er

Nedanstående kriterier måste vara uppfyllda för att go-live ska godkännas av CAB:

| Kriterium | Tröskel | Verifieras av | Status |
|-----------|---------|---------------|--------|
| Tillgänglighet i staging ≥ 99,0 % (5 dagar) | 99,0 % | Karl Eek | ☐ |
| Deflection rate i pilottest ≥ 30 % | 30 % | Anna Berg | ☐ |
| Noll P1/P2-incidenter fastnar hos AI-agenten | 0 | Anna Berg | ☐ |
| Eskaleringskvalitet ≥ 85 % (pilot) | 85 % | Karl Eek | ☐ |
| Kunskapsbasens täckning: ≥ 80 % av artiklar har ägare | 80 % | Karl Eek | ☐ |
| CloudFrame och Lumeon bekräftar produktionsredo status | Skriftligt | Anna Berg | ☐ |

> **Om ett eller flera kriterier inte är uppfyllda:** Fortsätt med begränsad rollout (t.ex. pilotgrupp på 50 personer) och sätt nytt go/no-go-datum inom 14 dagar.

---

## Uppföljning

- **Frekvens:** Veckovis under hypercare (vecka 1–4 post go-live); månadsvis därefter
- **Forum:** IT Ops-möte (Anna Berg) + kvartalsmöte med Martin Lindqvist
- **Rapportformat:** Dashboard i [verktyg TBD] + månadsrapport till CAB
