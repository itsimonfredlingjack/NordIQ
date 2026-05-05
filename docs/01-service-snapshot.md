# Service Snapshot – NordIQ

> **Dokumenttyp:** Tjänstedefinition  
> **Ägare:** Karl Eek (tjänstebeskrivning), Anna Berg (drift)  
> **Version:** 1.0

---

## 1. Service Definition

> **NordIQ är en intern IT-supporttjänst som gör det möjligt för NordTechs medarbetare att snabbt få korrekt, spårbar och dygnet-runt-tillgänglig hjälp med vanliga IT-ärenden, utan att själva behöva veta rätt supportväg eller vänta på manuell first line för återkommande frågor.**

**Tjänstens namn:** NordIQ  
**Typ:** Intern IT-tjänst (AI-stödd service desk)  
**Kanaler:** Microsoft Teams, e-post, webbportal  
**Tillgänglighet:** 24/7  
**Målgrupp:** Alla medarbetare på NordTech AB (~450 personer)

---

## 2. Consumers & Stakeholders

| Aktör | Typ | Relation till tjänsten |
|-------|-----|------------------------|
| Medarbetare | Primär konsument | Ställer frågor, rapporterar fel |
| First line support | Intern | Tar emot eskalerade ärenden |
| Second line / Dev | Intern | Löser komplexa ärenden |
| Anna Berg | Tjänsteägare (drift) | Ansvarar för driftmodell och SLO-uppföljning |
| Karl Eek | Tjänsteägare (tech) | Ansvarar för plattform, integrationer, kunskapsbas |
| Martin Lindqvist | Sponsor/CIO | Godkänner go-live, äger budget |
| Erik Holm | CFO | Granskar kostnad och ROI |
| Lina Nordin | Head of HR | Berörs av onboarding-flöden |
| CloudFrame Nordic | Leverantör | Drift och hosting |
| Lumeon | Leverantör | LLM-leverantör (AI-API) |

---

## 3. Value Statement

**För medarbetare:** Snabb, korrekt och alltid tillgänglig IT-hjälp – utan att veta vilken supportväg som gäller.

**För NordTech AB:**
- Reducerat tryck på first line → kostnadseffektivare supportorganisation
- Strukturerad data om ärenden → bättre beslutsunderlag för CI och problem management
- Skalbar support inför tillväxt

**Antagande:** Go-live förväntas deflektera minst 40 % av inkommande first-line-ärenden inom 3 månader.

---

## 4. Utility vs Warranty

### Utility (vad tjänsten gör)

- Svarar på vanliga IT-frågor direkt via NLP/AI
- Skapar och routa ärenden strukturerat till rätt supportgrupp
- Söker i kunskapsbas och returnerar relevanta artiklar
- Hanterar onboarding-relaterade frågor via HR-integrerat flöde
- Eskalerar P1/P2-incidenter omedelbart till människa

### Warranty (att tjänsten gör det tillförlitligt)

- **Tillgänglighet:** 99,0 % per månad (exkl. planerat underhåll)
- **Svarstid:** Första svar inom 10 sekunder för 95 % av förfrågningarna
- **Säkerhet:** Autentisering via [Antagande: Azure AD]; ingen PII lagras i AI-kontext
- **Spårbarhet:** Alla ärenden loggas med ärendenummer och tidstämplar
- **Eskalering:** 100 % av P1/P2 eskaleras till människa inom 60 sekunder

### Risker kopplade till warranty

- Lumeon API-avbrott kan påverka AI-svarsfunktionen (LLM-leverantör)
- CloudFrame-driftstörning kan stoppa hela plattformen (hosting)
- Felaktig NLP-klassificering kan leda till felrouting

---

## 5. Four Dimensions

| Dimension | Beskrivning för NordIQ |
|-----------|------------------------|
| **Organisations & People** | Anna Berg äger drift; Karl Eek äger tech; first line och second line ingår i eskaleringskedjan. Lina Nordin involveras för HR-flöden. Rollbeskrivningar och eskaleringsansvar är dokumenterade i [03-operational-readiness.md](03-operational-readiness.md). |
| **Information & Technology** | LLM/AI via Lumeon API; drift och hosting via CloudFrame Nordic; kunskapsbas i [Antagande: SharePoint eller motsvarande]; autentisering via [Antagande: Azure AD]. All data klassificeras enligt NordTechs informationssäkerhetspolicy. Antagande: GDPR-compliance hanteras inom molnmiljön. |
| **Partners & Suppliers** | Två kritiska leverantörer: Lumeon (LLM-leverantör/AI-API) och CloudFrame Nordic (drift och hosting). Båda har SLA-avtal. Övervakningsstatus ingår i SLO-uppföljning. Se [risk-register.md](risk-register.md) för leverantörsrisker. |
| **Value Streams & Processes** | Primärt flöde: Förfrågan → NordIQ → Direkt svar ELLER strukturerad ticket → Second line → Lösning → Kunskapsbasuppdatering. Incident Management, Problem Management och Continual Improvement är definierade i [03-operational-readiness.md](03-operational-readiness.md). |
