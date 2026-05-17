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

