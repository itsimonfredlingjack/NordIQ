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
import type { ServiceRequestPacket } from "../intake/types";

const TAG_OPEN = "<NORDIQ";
const TAG_CLOSE = "/>";
const PACKET_OPEN = "<NORDIQ_PACKET>";
const PACKET_CLOSE = "</NORDIQ_PACKET>";

interface ExtractResult {
  visible: string;
  tag: ParsedTag | null;
  /** Parsed IT-intake packet, if the model emitted one in this turn. */
  packet: ServiceRequestPacket | null;
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
//
// Robust against the model sometimes splitting the tag across stream
// chunks (e.g. "<NO" then "RDIQ classification=" then ".../>"). We
// take the LAST complete tag in the buffer in case the model emits
// more than one — only the final one matters.
// ---------------------------------------------------------------------
export function extract(buf: string, final = false): ExtractResult {
  // Strip out a <NORDIQ_PACKET>...</NORDIQ_PACKET> block first, parse
  // it, and remove it from the buffer used for visible text + tag
  // extraction. The model frequently drops the close tag and stops
  // mid-JSON, so we have several fallbacks.
  let workBuf = buf;
  let packet: ServiceRequestPacket | null = null;

  const packetStart = workBuf.indexOf(PACKET_OPEN);
  if (packetStart >= 0) {
    const packetEnd = workBuf.indexOf(PACKET_CLOSE, packetStart);
    if (packetEnd >= 0) {
      const json = workBuf
        .slice(packetStart + PACKET_OPEN.length, packetEnd)
        .trim();
      packet = parsePacket(json);
      workBuf =
        workBuf.slice(0, packetStart) +
        workBuf.slice(packetEnd + PACKET_CLOSE.length);
    } else {
      // No close tag yet. Three cases:
      //   (a) Final <NORDIQ /> tag appears after the packet open — the
      //       model dropped </NORDIQ_PACKET>. Treat the position of
      //       <NORDIQ as the de-facto close.
      //   (b) `final` pass with neither close nor final tag — the model
      //       stopped mid-JSON. Try to repair-parse what we have.
      //   (c) Truly in-flight (streaming) — hide from PACKET_OPEN.
      // Search for the final <NORDIQ /> tag *after* the PACKET_OPEN
       // string itself — otherwise we'd match the leading "<NORDIQ" of
       // <NORDIQ_PACKET> and treat the empty body as the JSON.
      const fallbackClose = workBuf.indexOf(
        TAG_OPEN,
        packetStart + PACKET_OPEN.length,
      );
      if (fallbackClose >= 0) {
        const json = workBuf
          .slice(packetStart + PACKET_OPEN.length, fallbackClose)
          .trim();
        packet = parsePacket(json);
        workBuf =
          workBuf.slice(0, packetStart) + workBuf.slice(fallbackClose);
      } else if (final) {
        const json = workBuf.slice(packetStart + PACKET_OPEN.length).trim();
        packet = parsePacket(json);
        workBuf = workBuf.slice(0, packetStart);
      } else {
        workBuf = workBuf.slice(0, packetStart);
      }
    }
  }

  const lastStart = workBuf.lastIndexOf(TAG_OPEN);
  if (lastStart < 0) {
    return {
      visible: trimTrailingTagPrefix(workBuf),
      tag: null,
      packet,
    };
  }
  const end = workBuf.indexOf(TAG_CLOSE, lastStart);
  const visible = workBuf.slice(0, lastStart).replace(/\s+$/, "");
  if (end < 0) {
    return { visible, tag: null, packet };
  }
  const raw = workBuf.slice(lastStart, end + TAG_CLOSE.length);
  return { visible, tag: parseTag(raw), packet };
}

// ---------------------------------------------------------------------
// parsePacket — strict JSON.parse with a shape validation pass. If
// the model produced something unparseable, we silently drop the
// packet rather than crash; the agent's prose still renders.
// ---------------------------------------------------------------------
function parsePacket(raw: string): ServiceRequestPacket | null {
  try {
    // Some models wrap JSON in ```json fences. Strip them defensively.
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
    // gemma4:e2b sometimes hits stop mid-JSON — leaving unclosed
    // arrays/objects. Try a strict parse first; fall back to a
    // balance-the-braces repair pass.
    const parsed = tryParseOrRepair(cleaned);
    if (!parsed || typeof parsed !== "object") return null;
    const obj = parsed as Record<string, unknown>;
    if (
      !obj ||
      typeof obj !== "object" ||
      typeof obj.subject !== "string" ||
      !Array.isArray(obj.requests)
    ) {
      return null;
    }
    const requests = (obj.requests as unknown[])
      .filter(
        (r): r is Record<string, unknown> =>
          typeof r === "object" && r !== null,
      )
      .map((r: Record<string, unknown>, i: number) => ({
        id: typeof r.id === "string" ? r.id : `REQ-${i}`,
        title: typeof r.title === "string" ? r.title : "Untitled request",
        service: typeof r.service === "string" ? r.service : "—",
        routedTo:
          typeof r.routedTo === "string" ? r.routedTo : "IT Ops on-call",
        body: typeof r.body === "string" ? r.body : "",
        approvers: Array.isArray(r.approvers)
          ? (r.approvers as unknown[]).filter(
              (x): x is string => typeof x === "string",
            )
          : [],
        status: normalizeStatus(r.status),
      }));
    return {
      id: typeof obj.id === "string" ? obj.id : `PKT-${Date.now()}`,
      subject: obj.subject,
      createdAt:
        typeof obj.createdAt === "string"
          ? obj.createdAt
          : new Date().toISOString(),
      intent: typeof obj.intent === "string" ? obj.intent : "",
      requests,
      missing: Array.isArray(obj.missing)
        ? (obj.missing as unknown[])
            .filter(
              (m): m is Record<string, unknown> =>
                typeof m === "object" && m !== null,
            )
            .map((m: Record<string, unknown>) => ({
              field: typeof m.field === "string" ? m.field : "",
              why: typeof m.why === "string" ? m.why : "",
            }))
            .filter((m) => m.field)
        : [],
      risks: Array.isArray(obj.risks)
        ? (obj.risks as unknown[])
            .filter(
              (r): r is Record<string, unknown> =>
                typeof r === "object" && r !== null,
            )
            .map((r: Record<string, unknown>) => ({
              label: typeof r.label === "string" ? r.label : "",
              detail: typeof r.detail === "string" ? r.detail : "",
              severity:
                r.severity === "block" || r.severity === "warn"
                  ? r.severity
                  : "info",
            }))
            .filter((r) => r.label)
        : [],
      // Derived from the normalized request statuses — never trust the
      // model's self-reported readyToSubmit. A request that's
      // needs_input / needs_approval / blocked must block submit.
      readyToSubmit:
        requests.length > 0 && requests.every((r) => r.status === "ready"),
    } as ServiceRequestPacket;
  } catch {
    return null;
  }
}

// Try strict JSON.parse, then a forgiving repair pass for the common
// "model stopped mid-emit" failure modes:
//   - trailing comma before } or ]
//   - unclosed arrays/objects (count brackets, append missing closers)
//   - dangling field with `"key":` and no value
function tryParseOrRepair(raw: string): unknown | null {
  try {
    return JSON.parse(raw);
  } catch {
    // fall through
  }

  // Walk the input character-by-character, tracking quote/escape and
  // bracket depth. Stop at the index where the depth returns to 0
  // for the FIRST top-level object — that's the model's intended JSON.
  // Anything after that (extra commas, trailing braces, partial second
  // object) is discarded.
  let depth = 0;
  let inString = false;
  let escape = false;
  let firstClose = -1;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (c === "\\") {
      escape = true;
      continue;
    }
    if (c === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (c === "{" || c === "[") depth++;
    else if (c === "}" || c === "]") {
      depth--;
      if (depth === 0) {
        firstClose = i;
        break;
      }
    }
  }
  if (firstClose >= 0) {
    try {
      return JSON.parse(raw.slice(0, firstClose + 1));
    } catch {
      // fall through to balance pass
    }
  }

  // Balance-the-brackets repair for truly truncated JSON.
  let s = raw.trim();
  s = s.replace(/,\s*"[^"]*"\s*:\s*$/, "");
  s = s.replace(/"[^"]*"\s*:\s*$/, "");
  s = s.replace(/,\s*$/, "");
  s = s.replace(/,(\s*[}\]])/g, "$1");
  const opens: string[] = [];
  inString = false;
  escape = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (c === "\\") {
      escape = true;
      continue;
    }
    if (c === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (c === "{" || c === "[") opens.push(c);
    else if (c === "}" || c === "]") opens.pop();
  }
  if (inString) s += '"';
  s = s.replace(/,\s*$/, "");
  while (opens.length > 0) {
    const o = opens.pop();
    s += o === "{" ? "}" : "]";
  }
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function normalizeStatus(s: unknown): ServiceRequestPacket["requests"][number]["status"] {
  if (s === "ready" || s === "needs_input" || s === "needs_approval" || s === "blocked") {
    return s;
  }
  return "needs_input";
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
