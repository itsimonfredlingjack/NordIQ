// =====================================================================
// Mock knowledge base — 8 articles covering NordIQ's first-line scope.
//
// Each entry is what would normally sit behind a real KB tool (Confluence,
// SharePoint, ServiceNow, …). Phase 4 keeps it in-process so the demo
// runs without extra infra. The frontmatter (owner, reviewedAt) backs
// SLO #6: "100 % of articles the agent is allowed to use must have an
// owner and a review date".
//
// Content tone matches the NordIQ persona: calm, concrete, named systems.
// =====================================================================

export type KBCategory =
  | "account"
  | "access"
  | "device"
  | "network"
  | "security"
  | "onboarding";

export interface KBArticle {
  id: string;
  title: string;
  category: KBCategory;
  owner: string;
  reviewedAt: string; // ISO date
  nextReviewDue: string; // ISO date
  body: string;
  keywords: string[];
}

export const KB_ARTICLES: KBArticle[] = [
  {
    id: "KB-014",
    title: "Reset your NordID password",
    category: "account",
    owner: "Anna Berg",
    reviewedAt: "2026-04-12",
    nextReviewDue: "2026-10-12",
    body: `Use the self-service portal at nordid.nordtech.se. Sign in with your work email and the verification code sent to your registered phone number; the form will then prompt you to set a new password.

Passphrases of 14+ characters are required. The portal rejects any of your last five passwords and any string that contains your username or "NordTech".

If the verification SMS doesn't arrive within two minutes, use the authenticator app fallback (KB-080). If you have neither, contact IT Ops on-call — never share a one-time code with anyone, including support staff.`,
    keywords: [
      "password",
      "passwords",
      "reset",
      "nordid",
      "locked out",
      "lockout",
      "sign in",
      "login",
      "credentials",
      "lösenord",
      "återställa",
    ],
  },
  {
    id: "KB-031",
    title: "Consultant onboarding checklist",
    category: "onboarding",
    owner: "Lina Nordin",
    reviewedAt: "2026-02-04",
    nextReviewDue: "2026-08-04",
    body: `Consultants get a NordTech-issued laptop, a NordID account scoped to "external", and a finite end-date that mirrors the engagement contract. HR raises the request in Workday at least three working days before start; IT Ops provisions the account, security profile, and laptop image overnight.

Day-1 access bundle: NordID, Microsoft 365 (Mail / Teams / OneDrive), VPN profile (KB-046), and read-only access to the Engagement project space. NordTrack and other production systems require a separate access request (KB-058) approved by the engagement owner.

End-of-engagement is automated: 24 hours after the contract end-date the account is disabled, the laptop is wiped on next check-in, and the consultant's manager gets a closeout email. If a consultant is extended, HR updates the end-date in Workday — IT Ops never extends accounts directly.`,
    keywords: [
      "consultant",
      "konsult",
      "onboarding",
      "new hire",
      "starts",
      "monday",
      "laptop",
      "access",
      "provision",
      "workday",
      "external",
      "engagement",
    ],
  },
  {
    id: "KB-046",
    title: "VPN setup for Mac and Windows",
    category: "network",
    owner: "Anna Berg",
    reviewedAt: "2025-11-04",
    nextReviewDue: "2026-05-04",
    body: `NordTech uses NordVPN-Edge with always-on profiles. The VPN client is pre-installed on managed laptops; you sign in once with your NordID and the profile auto-connects on every untrusted network.

If the connection fails: open the menu-bar icon, choose "Sign out", quit the client, and re-launch from /Applications (Mac) or Start (Windows). On Mac, also check that the Network Extension permission is enabled under System Settings → Network → Filters. A stale extension after macOS upgrades is the most common cause of "VPN won't connect" tickets.

Don't reinstall the client unless IT Ops asks you to — the install pulls a per-device certificate that takes ~10 minutes to re-issue. If reauth and a relaunch don't fix it, open a ticket and include the connection log (menu-bar icon → "Copy diagnostics").`,
    keywords: [
      "vpn",
      "nordvpn",
      "edge",
      "won't connect",
      "wont connect",
      "disconnect",
      "mac",
      "macos",
      "windows",
      "network",
      "remote",
      "tunnel",
    ],
  },
  {
    id: "KB-058",
    title: "Request access to NordTrack",
    category: "access",
    owner: "Karl Eek",
    reviewedAt: "2026-02-19",
    nextReviewDue: "2026-08-19",
    body: `NordTrack is the case-management system for billable engagements. Access is role-based and approved by your engagement owner — there is no self-serve path.

Open Workday → Service Requests → "NordTrack access". Pick your role (Reader, Contributor, Approver) and the engagement(s) you need; the request goes to the engagement owner for sign-off and provisioning normally completes within four working hours.

If you can't log in to NordTrack and you already had access yesterday, this is not an access request — it's an incident. Please don't open an access ticket; flag it to the agent or IT Ops on-call so we can check the auth subsystem before more users hit it.`,
    keywords: [
      "nordtrack",
      "access",
      "request",
      "engagement",
      "case management",
      "approver",
      "contributor",
      "reader",
      "workday",
      "permissions",
    ],
  },
  {
    id: "KB-061",
    title: "Microsoft Teams meeting room kit",
    category: "device",
    owner: "Anna Berg",
    reviewedAt: "2026-01-16",
    nextReviewDue: "2026-07-16",
    body: `Each Göteborg, Stockholm and Malmö conference room has a Logitech Rally Bar Mini paired with a Surface Hub-style touch console. To start a meeting: tap the room name in the console, sign in with your NordID, and pick the meeting from the list.

If the console is dark, push the small reset button under the table edge — it cycles power without disconnecting the room from Teams Rooms management. If the camera or mic is missing from a Teams call, switch the input source on the console (gear icon → "Devices") rather than reinstalling anything.

Hardware faults (cracked panel, broken cable, ghost-touch) are the only reason to open a ticket — software glitches are almost always a console reset away.`,
    keywords: [
      "teams",
      "meeting",
      "room",
      "rally",
      "bar",
      "console",
      "conference",
      "video",
      "camera",
      "microphone",
      "logitech",
    ],
  },
  {
    id: "KB-072",
    title: "Phishing reporting and what NOT to do",
    category: "security",
    owner: "Karl Eek",
    reviewedAt: "2026-03-22",
    nextReviewDue: "2026-09-22",
    body: `Suspicious emails — anything asking you to "verify your password", "confirm your account", or that contains an attachment you didn't expect — should be reported, not investigated.

In Outlook, click the "Report → Phishing" button in the ribbon. The mail goes to Security on-call and is removed from your inbox automatically. Don't forward it to colleagues, don't click the link "just to check", don't reply to the sender, and don't preview attachments.

If you already clicked something or entered credentials, don't try to "fix it" — change your password immediately via KB-014, then call Security on-call. The faster we know, the smaller the blast radius.`,
    keywords: [
      "phishing",
      "phish",
      "suspicious",
      "email",
      "verify",
      "password",
      "click",
      "link",
      "attachment",
      "report",
      "security",
      "scam",
    ],
  },
  {
    id: "KB-080",
    title: "MFA and authenticator app setup",
    category: "account",
    owner: "Anna Berg",
    reviewedAt: "2026-04-02",
    nextReviewDue: "2026-10-02",
    body: `NordID requires multi-factor authentication for everything beyond the intranet homepage. The supported factors are Microsoft Authenticator (recommended), an SMS code to your registered phone, and a YubiKey for engineering roles.

To enrol the authenticator app: sign in to nordid.nordtech.se, open Settings → Security, and choose "Add method → Authenticator app". The portal shows a QR code; scan it from inside Microsoft Authenticator on the phone you'll keep with you.

If you replace your phone, enrol the new device first (using the SMS fallback if needed) and only then remove the old one. Losing the only enrolled factor means a desk-side reset, which we do at a NordTech office or via courier-verified ID.`,
    keywords: [
      "mfa",
      "2fa",
      "authenticator",
      "microsoft authenticator",
      "yubikey",
      "verification",
      "code",
      "factor",
      "qr code",
      "phone",
      "sms",
    ],
  },
  {
    id: "KB-091",
    title: "Order a replacement laptop",
    category: "device",
    owner: "Anna Berg",
    reviewedAt: "2025-09-10",
    nextReviewDue: "2026-03-10",
    body: `Replacement laptops are ordered through Workday → Service Requests → "Replacement device". Choose the reason (broken, lost, stolen, end-of-life), and your manager will receive an approval task.

Standard turnaround is three working days for stock models and up to ten for engineering kits. While you wait, IT Ops can issue a loaner from the Göteborg or Stockholm reception desks — same-day if the request is in before 11:00.

If the laptop is lost or stolen, also call Security on-call so we can remote-wipe and revoke the device certificate before any data leaks. Don't try to track the device yourself.`,
    keywords: [
      "laptop",
      "replacement",
      "broken",
      "lost",
      "stolen",
      "order",
      "device",
      "macbook",
      "thinkpad",
      "loaner",
      "hardware",
    ],
  },
];
