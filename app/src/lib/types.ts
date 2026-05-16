// Slim — only what the chat surface needs.

export interface Employee {
  name: string;
  initials: string;
  role: string;
  department: string;
}

export type DecisionType =
  | "direct-answer"
  | "follow-up"
  | "ticket-created"
  | "incident-flagged";

export type MessageAuthor = "user" | "agent" | "system";

export interface KBSource {
  title: string;
  reviewedAt: string;
}

export interface MiniTicket {
  id: string;
  summary: string;
  routedTo: string;
  priority: "P1" | "P2" | "P3" | "P4";
}

export type ChatAttachment =
  | { kind: "kb"; sources: KBSource[] }
  | { kind: "follow-up"; questions: string[] }
  | { kind: "ticket"; ticket: MiniTicket }
  | { kind: "escalation"; routedTo: string; reason: string }
  | { kind: "packet"; packet: import("./intake/types").ServiceRequestPacket };

export interface ChatMessage {
  id: string;
  author: MessageAuthor;
  content: string;
  timestamp: string;
  classification?: DecisionType;
  confidence?: "high" | "medium" | "low";
  attachments?: ChatAttachment[];
  /** Base64-encoded images attached to a user message (no data: prefix).
   * Only populated for `author === "user"`; persisted to localStorage so
   * reload preserves the visual context. */
  images?: string[];
}
