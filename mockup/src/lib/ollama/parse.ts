// =====================================================================
// <NORDIQ /> tag streaming extractor
// The model finishes every reply with a self-closing <NORDIQ … /> tag
// that we strip from the visible content and turn into ChatAttachments.
//
// Stream-safe: feed the running buffer in on every chunk and we'll
// hand back what's safe to render now plus a parsed tag once it's
// fully arrived.
// =====================================================================

import type { ChatAttachment, DecisionType } from "../types";

const TAG_OPEN = "<NORDIQ";
const TAG_CLOSE = "/>";

interface ExtractResult {
  visible: string;
  tag: ParsedTag | null;
  /** True if the model has started writing the tag (so we know not to
   * render the partial fragment yet). */
  tagInFlight: boolean;
}

interface ParsedTag {
  classification: DecisionType;
  confidence: "high" | "medium" | "low";
  route?: string;
  service?: string;
  priority?: "P1" | "P2" | "P3" | "P4";
  ticketId?: string;
  reason?: string;
  questions?: string[];
  sourceTitle?: string;
  sourceReviewedAt?: string;
}

// ---------------------------------------------------------------------
// extract — pure function over the running buffer.
// Always returns the visible prefix safe to render. Once the tag is
// closed, returns the parsed object too.
// ---------------------------------------------------------------------
export function extract(buf: string): ExtractResult {
  const start = buf.indexOf(TAG_OPEN);
  if (start < 0) {
    return { visible: trimTrailingTagPrefix(buf), tag: null, tagInFlight: false };
  }
  const end = buf.indexOf(TAG_CLOSE, start);
  const visible = buf.slice(0, start).replace(/\s+$/, "");
  if (end < 0) {
    // Tag opened but not yet closed.
    return { visible, tag: null, tagInFlight: true };
  }
  const raw = buf.slice(start, end + TAG_CLOSE.length);
  return { visible, tag: parseTag(raw), tagInFlight: false };
}

// ---------------------------------------------------------------------
// parseTag — accepts the full <NORDIQ … /> string.
// Returns null if classification is missing or invalid; the caller
// then falls back to a default attachment-less render.
// ---------------------------------------------------------------------
function parseTag(raw: string): ParsedTag | null {
  const attrs = readAttributes(raw);
  const classification = normalizeClassification(attrs.classification);
  if (!classification) return null;

  const confidenceRaw = (attrs.confidence ?? "high").toLowerCase();
  const confidence: ParsedTag["confidence"] =
    confidenceRaw === "low" || confidenceRaw === "medium" ? confidenceRaw : "high";

  const out: ParsedTag = { classification, confidence };

  if (attrs.route) out.route = attrs.route;
  if (attrs.service) out.service = attrs.service;
  const pri = (attrs.priority ?? "").toUpperCase();
  if (pri === "P1" || pri === "P2" || pri === "P3" || pri === "P4") {
    out.priority = pri;
  }
  if (attrs.ticket_id) out.ticketId = attrs.ticket_id;
  if (attrs.reason) out.reason = attrs.reason;
  if (attrs.questions) {
    out.questions = attrs.questions
      .split("|")
      .map((q) => q.trim())
      .filter(Boolean);
  }
  if (attrs.source) {
    const [title, date] = attrs.source.split("|").map((s) => s.trim());
    if (title) out.sourceTitle = title;
    if (date) out.sourceReviewedAt = date;
  }
  return out;
}

// Loose attribute reader — accepts both "double" and 'single' quotes,
// treats keys case-insensitively, tolerant to extra whitespace and
// stray escape characters that some models emit (e.g. `\"`).
function readAttributes(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  // Strip the outer <NORDIQ ... /> shell.
  const inner = raw
    .replace(/^<NORDIQ\s*/, "")
    .replace(/\/>\s*$/, "")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'");
  const re = /([a-zA-Z_][a-zA-Z0-9_-]*)\s*=\s*("([^"]*)"|'([^']*)')/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(inner)) !== null) {
    const key = m[1].toLowerCase();
    const value = (m[3] ?? m[4] ?? "").trim();
    if (value) out[key] = value;
  }
  return out;
}

function normalizeClassification(raw?: string): DecisionType | null {
  if (!raw) return null;
  const v = raw.toLowerCase().trim();
  if (
    v === "direct-answer" ||
    v === "follow-up" ||
    v === "ticket-created" ||
    v === "incident-flagged"
  ) {
    return v;
  }
  return null;
}

// Don't reveal a half-typed tag fragment ("<NOR" or "<NORDIQ classi…")
// while it's in-flight. Strip any trailing fragment that *could* be
// the start of TAG_OPEN.
function trimTrailingTagPrefix(buf: string): string {
  for (let len = TAG_OPEN.length - 1; len > 0; len--) {
    if (buf.endsWith(TAG_OPEN.slice(0, len))) {
      return buf.slice(0, buf.length - len).replace(/\s+$/, "");
    }
  }
  return buf;
}

// ---------------------------------------------------------------------
// tagToAttachments — turn a ParsedTag into ChatAttachments that
// AgentMessage already knows how to render.
// ---------------------------------------------------------------------
export function tagToAttachments(tag: ParsedTag): ChatAttachment[] {
  const out: ChatAttachment[] = [];

  if (tag.classification === "direct-answer" && tag.sourceTitle) {
    out.push({
      kind: "kb",
      sources: [
        {
          title: tag.sourceTitle,
          reviewedAt: tag.sourceReviewedAt ?? "—",
        },
      ],
    });
  }

  if (tag.classification === "follow-up" && tag.questions?.length) {
    out.push({
      kind: "follow-up",
      questions: tag.questions,
    });
  }

  if (tag.classification === "ticket-created") {
    out.push({
      kind: "ticket",
      ticket: {
        id: tag.ticketId ?? mintTicketId(false),
        summary: tag.reason ?? "Structured ticket",
        routedTo: tag.route ?? "L2 — generalist",
        priority: tag.priority ?? "P3",
      },
    });
  }

  if (tag.classification === "incident-flagged") {
    out.push({
      kind: "escalation",
      routedTo: tag.route ?? "On-call engineer",
      reason:
        tag.reason ??
        (tag.service ? `Pattern on ${tag.service}` : "Multi-user pattern"),
    });
  }

  return out;
}

// Small fictional ticket-id minter for when the model forgets one.
function mintTicketId(incident: boolean): string {
  const n = 200000 + Math.floor(Math.random() * 9999);
  return `${incident ? "INC" : "REQ"}-${n}`;
}

export type { ParsedTag };
