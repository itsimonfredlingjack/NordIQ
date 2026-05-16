// =====================================================================
// Shadow Replay tag parsers — separate from the main chat parser
// because replay output is metadata-only (no prose, no decision tag,
// just a single classification element per call).
//
// Two tags:
//   <NORDIQ_REPLAY kind="..." confidence="..." reason="..." />
//   <NORDIQ_CLUSTER ticket="T-002" cluster="nordtrack-auth" />
//
// Both are tolerant to leading/trailing prose: we just hunt for the
// pattern. If gemma4:e2b accidentally writes a sentence first, the
// classifier still works.
// =====================================================================

import type { ReplayClassification, ReplayKind } from "./types";

const REPLAY_RE =
  /<NORDIQ_REPLAY\b([^/>]*?)\/>/i;
const CLUSTER_RE =
  /<NORDIQ_CLUSTER\b([^/>]*?)\/>/gi;

const ATTR_RE = /([a-zA-Z_][a-zA-Z0-9_-]*)\s*=\s*("([^"]*)"|'([^']*)')/g;

function readAttrs(inner: string): Record<string, string> {
  const out: Record<string, string> = {};
  // Tolerate accidental backslash-escaping that some streams emit.
  const cleaned = inner.replace(/\\"/g, '"').replace(/\\'/g, "'");
  let m: RegExpExecArray | null;
  while ((m = ATTR_RE.exec(cleaned)) !== null) {
    out[m[1].toLowerCase()] = (m[3] ?? m[4] ?? "").trim();
  }
  return out;
}

function normalizeKind(raw?: string): ReplayKind | null {
  const v = (raw ?? "").toLowerCase().trim();
  if (v === "deflect" || v === "escalate" || v === "incident" || v === "security") {
    return v;
  }
  // Sometimes the model says "deflected" / "escalation" / etc — map back.
  if (v.startsWith("defle")) return "deflect";
  if (v.startsWith("escal")) return "escalate";
  if (v.startsWith("incid")) return "incident";
  if (v.startsWith("secur") || v.startsWith("phish")) return "security";
  return null;
}

export function parseReplayTag(buf: string): ReplayClassification | null {
  const m = buf.match(REPLAY_RE);
  if (!m) return null;
  const attrs = readAttrs(m[1]);
  const kind = normalizeKind(attrs.kind);
  if (!kind) return null;
  const confRaw = (attrs.confidence ?? "high").toLowerCase();
  const confidence: ReplayClassification["confidence"] =
    confRaw === "low" || confRaw === "medium" ? confRaw : "high";
  return {
    kind,
    confidence,
    reason: attrs.reason ?? "",
    // cluster is filled in by the second pass, not here
  };
}

/** Extract every <NORDIQ_CLUSTER /> tag → { ticketId: clusterKey }. */
export function parseClusterTags(buf: string): Record<string, string> {
  const out: Record<string, string> = {};
  let m: RegExpExecArray | null;
  // exec on global regex needs lastIndex reset between calls
  CLUSTER_RE.lastIndex = 0;
  while ((m = CLUSTER_RE.exec(buf)) !== null) {
    const attrs = readAttrs(m[1]);
    if (attrs.ticket && attrs.cluster) {
      out[attrs.ticket] = attrs.cluster;
    }
  }
  return out;
}
