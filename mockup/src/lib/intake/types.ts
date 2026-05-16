// =====================================================================
// IT-intake packet — what NordIQ produces from a free-text HR request.
//
// HR (Lina) owns the person. NordIQ owns the *IT* side: turning the
// rough request into structured service requests that the right IT
// team can actually pick up. One free-text input → N tickets, with
// missing fields, approvals, routing and a ready-to-submit verdict.
// =====================================================================

export type RequestStatus =
  | "ready"        // all fields filled, all approvals known, can submit
  | "needs_input"  // missing field(s) from the user
  | "needs_approval" // waiting on a named approver before submit
  | "blocked";     // a risk or dependency is preventing submit

export type IntakeTeam =
  | "Endpoint team"
  | "Identity team"
  | "Network team"
  | "Service owner"
  | "Security on-call"
  | "IT Ops on-call";

export interface ServiceRequest {
  /** Stable id within this packet — "REQ-A" "REQ-B" etc. */
  id: string;
  /** Short human-readable name. */
  title: string;
  /** Which system or service this request targets (NordID, NordTrack, etc). */
  service: string;
  /** Who picks this up. */
  routedTo: IntakeTeam;
  /** What's actually being requested, in plain language. */
  body: string;
  /** Who has to approve before this is actionable. Empty array = no approval needed. */
  approvers: string[];
  status: RequestStatus;
}

export interface MissingField {
  field: string;
  why: string;
}

export interface IntakeRisk {
  /** Short label for the row. */
  label: string;
  /** One-sentence explanation. */
  detail: string;
  severity: "info" | "warn" | "block";
}

export interface ServiceRequestPacket {
  /** Stable id for the whole packet. */
  id: string;
  /** Who this packet is for ("Hassan Karim, Junior Consultant"). */
  subject: string;
  /** When the packet was generated. */
  createdAt: string;
  /** A one-line summary of what HR asked for. */
  intent: string;
  requests: ServiceRequest[];
  missing: MissingField[];
  risks: IntakeRisk[];
  /** Overall verdict — derived from the requests' statuses. */
  readyToSubmit: boolean;
}

// ---------------------------------------------------------------------
// Hard-coded example — used to develop the UI before the model can
// produce one. Mirrors the Hassan Karim starter prompt.
// ---------------------------------------------------------------------
export const EXAMPLE_PACKET: ServiceRequestPacket = {
  id: "PKT-204801",
  subject: "Hassan Karim · Junior Consultant · 6 mo",
  createdAt: new Date().toISOString(),
  intent:
    "HR asked NordIQ to set up a new junior consultant starting Monday, sponsor Erik Holm.",
  requests: [
    {
      id: "REQ-A",
      title: "Provision NordID account (external)",
      service: "NordID",
      routedTo: "Identity team",
      body: "Create external-scope NordID for Hassan Karim. End-date mirrors engagement contract (180 days). Initial password sent to sponsor.",
      approvers: ["Erik Holm (sponsor)"],
      status: "needs_approval",
    },
    {
      id: "REQ-B",
      title: "Issue laptop + day-1 image",
      service: "Endpoint",
      routedTo: "Endpoint team",
      body: "Standard consultant laptop (MacBook Pro 14, 16 GB). Image with NordID-joined profile. Collection: Göteborg reception, Mon 08:30.",
      approvers: [],
      status: "ready",
    },
    {
      id: "REQ-C",
      title: "Microsoft 365 + Teams license",
      service: "Microsoft 365",
      routedTo: "Identity team",
      body: "M365 E3 license, Teams enabled, OneDrive provisioned. Engagement project space (read-only) granted.",
      approvers: [],
      status: "ready",
    },
    {
      id: "REQ-D",
      title: "NordVPN-Edge profile",
      service: "NordVPN-Edge",
      routedTo: "Network team",
      body: "Always-on profile bound to issued laptop's device certificate. Auto-connect on untrusted networks.",
      approvers: [],
      status: "ready",
    },
    {
      id: "REQ-E",
      title: "NordTrack access (role TBD)",
      service: "NordTrack",
      routedTo: "Service owner",
      body: "Engagement-scoped NordTrack access. Role not specified by HR.",
      approvers: ["Erik Holm (engagement owner)"],
      status: "needs_input",
    },
  ],
  missing: [
    {
      field: "NordTrack role",
      why: "HR didn't specify Reader / Contributor / Approver. Default: Reader unless overridden.",
    },
    {
      field: "Personal email for welcome packet",
      why: "Needed to send laptop pickup confirmation before NordID account is live.",
    },
  ],
  risks: [
    {
      label: "Sponsor approval pending",
      detail:
        "Erik Holm hasn't signed off in Workday yet. NordID + NordTrack blocked until he does.",
      severity: "warn",
    },
    {
      label: "Monday is a public holiday",
      detail:
        "Easter Monday — Endpoint team operates with reduced staffing. Laptop pickup may slip to Tuesday.",
      severity: "info",
    },
  ],
  readyToSubmit: false,
};
