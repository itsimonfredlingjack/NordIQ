// =====================================================================
// Shadow Replay — fixture + types.
//
// The replay surface streams a mocked "yesterday's queue" of first-line
// support requests through NordIQ to demonstrate, on stage, what the
// agent would have done with a realistic day's demand. This file owns
// the static fixture; classification is produced by the model at
// runtime via useShadowReplay.
// =====================================================================

export type ReplayKind =
  | "deflect" // FAQ-class, single user, agent answers directly
  | "escalate" // not autonomous-safe, route to human first-line
  | "incident" // multi-user pattern or service down, P1/P2
  | "security"; // phishing / credential prompt — security on-call

export interface ReplayClassification {
  kind: ReplayKind;
  confidence: "high" | "medium" | "low";
  /** One-sentence rationale shown in the live card. */
  reason: string;
  /** If non-empty, this ticket is part of a multi-ticket cluster — the
   * group key shared with siblings (e.g. "nordtrack-auth"). Set by the
   * second-pass clustering call after all classifications complete. */
  cluster?: string;
}

export interface ReplayTicket {
  id: string;
  /** Wall-clock time the ticket arrived (just for display). */
  receivedAt: string;
  /** Display name shown above the bubble. */
  from: string;
  /** Department / role — small helper to make duplicates feel real. */
  team?: string;
  /** The raw inbound text — what an employee actually typed. */
  text: string;
  /** Optional language hint just for the demo badge. */
  lang?: "en" | "sv";
}

export interface ReplayResult {
  ticket: ReplayTicket;
  classification: ReplayClassification | null;
  /** Time it took the model to classify, in ms. */
  durationMs?: number;
}

// ---------------------------------------------------------------------
// Yesterday's queue — twelve tickets, deliberately messy:
//   - mix of EN and SV
//   - one explicit duplicate cluster (3 NordTrack login reports)
//   - one onboarding (uses our packet machinery downstream)
//   - one phishing
//   - assorted FAQ
// Order is arrival-chronological. Cluster detection is the model's
// job — we don't pre-tag here.
// ---------------------------------------------------------------------
export const REPLAY_QUEUE: ReplayTicket[] = [
  {
    id: "T-001",
    receivedAt: "08:14",
    from: "Astrid Lindberg",
    team: "Marketing",
    text: "Hi, I'm locked out. Need to reset my password.",
    lang: "en",
  },
  {
    id: "T-002",
    receivedAt: "08:21",
    from: "Marcus Holm",
    team: "Engineering",
    text: "Time reporting keeps bouncing me back to login after SSO. No error, just loop.",
    lang: "en",
  },
  {
    id: "T-003",
    receivedAt: "08:24",
    from: "Petra Nilsson",
    team: "Engineering",
    text: "Several in backend channel can't register hours — auth loop after NordID.",
    lang: "en",
  },
  {
    id: "T-004",
    receivedAt: "08:29",
    from: "David Eriksson",
    team: "Engineering",
    text: "NordTrack throws me out the moment SSO completes. Anyone else?",
    lang: "en",
  },
  {
    id: "T-005",
    receivedAt: "08:33",
    from: "Sofia Bergström",
    team: "Sales",
    text: "VPN won't connect on my Mac. Worked fine yesterday.",
    lang: "en",
  },
  {
    id: "T-006",
    receivedAt: "08:38",
    from: "Johan Wallin",
    team: "Finance",
    text: "Got an email asking me to verify my password — looks suspicious. Should I click the link to check?",
    lang: "en",
  },
  {
    id: "T-007",
    receivedAt: "08:42",
    from: "Lina Nordin",
    team: "HR",
    text: "Hassan Karim starts Monday as a junior consultant on a 6-month engagement. Sponsor is Erik Holm. Please set him up.",
    lang: "en",
  },
  {
    id: "T-008",
    receivedAt: "08:47",
    from: "Erik Lundgren",
    team: "Operations",
    text: "Hej, jag är låst ute från mitt konto. Hur återställer jag lösenordet?",
    lang: "sv",
  },
  {
    id: "T-009",
    receivedAt: "08:52",
    from: "Karin Andersson",
    team: "Customer Success",
    text: "Need to set up the authenticator app on my new phone. Old phone is gone.",
    lang: "en",
  },
  {
    id: "T-010",
    receivedAt: "08:56",
    from: "Tobias Sjögren",
    team: "Engineering",
    text: "My laptop screen cracked yesterday — need a replacement before client meeting Thursday.",
    lang: "en",
  },
  {
    id: "T-011",
    receivedAt: "09:02",
    from: "Maria Olsson",
    team: "Office Management",
    text: "Conference room camera in Stockholm Loft is dark. Meeting in 20 minutes.",
    lang: "en",
  },
  {
    id: "T-012",
    receivedAt: "09:07",
    from: "Anders Magnusson",
    team: "Finance",
    text: "Got an email from \"Karl Eek\" asking me to forward our supplier bank list. Doesn't read like Karl. Real or phishing?",
    lang: "en",
  },
];
