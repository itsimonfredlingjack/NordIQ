// =====================================================================
// useShadowReplay — orchestrates the Shadow Replay run.
//
// Iterates the mocked queue, calls the local model once per ticket
// with a strict classification prompt, parses the <NORDIQ_REPLAY />
// tag, and updates state as each result arrives. Once all tickets are
// classified, runs a single "cluster these incidents" pass so the
// audience sees groups form on screen.
// =====================================================================

import { useCallback, useRef, useState } from "react";
import * as ollama from "@/lib/ollama/adapter";
import { parseClusterTags, parseReplayTag } from "@/lib/replay/parse";
import * as store from "@/lib/chat-store";
import { REPLAY_QUEUE, type ReplayResult, type ReplayTicket } from "@/lib/replay/types";

type Status = "idle" | "running" | "paused" | "done";

const CLASSIFY_PROMPT = `You are NordIQ in shadow mode — you are NOT writing back to the user.
You are a triage classifier. Look at one inbound first-line ticket and
decide what NordIQ would do with it.

Reply with EXACTLY ONE self-closing tag and NOTHING ELSE:

<NORDIQ_REPLAY kind="..." confidence="..." reason="..." />

kind:       deflect | escalate | incident | security
confidence: high | medium | low
reason:     ONE concise sentence, max 18 words. No quotes inside reason.

CLASSIFICATION GUIDE
- deflect: single-user, FAQ-class — password resets, VPN setup, MFA
  enrolment, laptop replacement, room hardware, onboarding intake.
  NordIQ resolves these without first-line triage.
- escalate: ambiguous, time-sensitive, or out-of-scope — needs a human.
- incident: multi-user pattern OR auth/login subsystem affected (P1/P2).
  NordTrack or NordID outages count as incident even if the user
  describes a downstream symptom (time reporting, billing, etc).
- security: phishing, credential prompt, sender impersonation, supplier
  bank-list requests — refuse and route to security.

Output ONLY the tag.`;

const CLUSTER_PROMPT = `You are NordIQ. Below are the tickets your last shadow run flagged
as "incident". Decide which ones describe the SAME underlying issue
and assign each a short cluster key (e.g. "nordtrack-auth").

Return EXACTLY ONE self-closing tag per ticket, in the same order, no
prose:

<NORDIQ_CLUSTER ticket="T-XXX" cluster="key" />

If a ticket doesn't share an underlying issue with any other in the
list, leave its cluster empty: cluster="".`;

export function useShadowReplay() {
  const [results, setResults] = useState<ReplayResult[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const cancelRef = useRef<{ aborted: boolean }>({ aborted: false });
  // Single-flight guard. React 18 StrictMode in dev mounts hooks twice
  // and a stray double-click can also race; either would otherwise
  // queue two parallel runs that both write to the same results list.
  const runningRef = useRef(false);
  const model = store.getModel();

  const classifyOne = useCallback(
    async (ticket: ReplayTicket): Promise<ReplayResult> => {
      const start = performance.now();
      let buf = "";
      try {
        const stream = ollama.chat({
          model,
          keepAlive: "30m",
          messages: [
            {
              role: "user",
              content: `${CLASSIFY_PROMPT}\n\n[TICKET ${ticket.id}]\nFrom: ${ticket.from} (${ticket.team ?? "—"})\n"${ticket.text}"`,
            },
          ],
        });
        for await (const piece of stream) {
          buf += piece;
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return {
          ticket,
          classification: {
            kind: "escalate",
            confidence: "low",
            reason: `Model call failed: ${msg.slice(0, 60)}`,
          },
          durationMs: performance.now() - start,
        };
      }
      const tag = parseReplayTag(buf);
      return {
        ticket,
        classification: tag ?? {
          kind: "escalate",
          confidence: "low",
          reason: "Classifier emitted no usable tag — defaulting to human triage.",
        },
        durationMs: performance.now() - start,
      };
    },
    [model],
  );

  const runClustering = useCallback(
    async (current: ReplayResult[]): Promise<ReplayResult[]> => {
      const incidents = current.filter((r) => r.classification?.kind === "incident");
      if (incidents.length < 2) return current;

      const list = incidents
        .map((r) => `${r.ticket.id} — ${r.ticket.from} (${r.ticket.team ?? "—"}): ${r.ticket.text}`)
        .join("\n");

      let buf = "";
      try {
        const stream = ollama.chat({
          model,
          keepAlive: "30m",
          messages: [
            {
              role: "user",
              content: `${CLUSTER_PROMPT}\n\n${list}`,
            },
          ],
        });
        for await (const piece of stream) {
          buf += piece;
        }
      } catch (e) {
        // Clustering is best-effort — if the model errors we keep the
        // per-ticket classifications as-is. But log it so the demo
        // operator can see "incidents weren't grouped because X" rather
        // than wondering why the cluster column is empty.
        console.warn("[shadow-replay] clustering failed, leaving incidents ungrouped:", e);
        return current;
      }

      const clusterMap = parseClusterTags(buf);
      if (Object.keys(clusterMap).length === 0) return current;

      return current.map((r) => {
        const c = clusterMap[r.ticket.id];
        if (!c || !r.classification) return r;
        return {
          ...r,
          classification: { ...r.classification, cluster: c },
        };
      });
    },
    [model],
  );

  const play = useCallback(async () => {
    if (runningRef.current || status === "running") return;
    runningRef.current = true;
    setError(null);
    cancelRef.current = { aborted: false };
    setStatus("running");

    try {
      // Resume from where we paused / start from scratch.
      const startIdx = results.length;
      const accumulated: ReplayResult[] = [...results];

      for (let i = startIdx; i < REPLAY_QUEUE.length; i++) {
        if (cancelRef.current.aborted) {
          setStatus("paused");
          return;
        }
        const ticket = REPLAY_QUEUE[i];
        // Pre-add as pending so the card animates in immediately. We
        // de-dupe by id in case a parallel run snuck through the
        // guard above (StrictMode quirks etc).
        setResults((prev) =>
          prev.some((r) => r.ticket.id === ticket.id)
            ? prev
            : [...prev, { ticket, classification: null }],
        );
        const result = await classifyOne(ticket);
        if (cancelRef.current.aborted) {
          setStatus("paused");
          return;
        }
        accumulated.push(result);
        setResults((prev) =>
          prev.map((r) => (r.ticket.id === ticket.id ? result : r)),
        );
      }

      // Cluster pass.
      const clustered = await runClustering(accumulated);
      if (clustered !== accumulated) {
        setResults(clustered);
      }
      setStatus("done");
    } finally {
      runningRef.current = false;
    }
  }, [classifyOne, runClustering, results, status]);

  const pause = useCallback(() => {
    cancelRef.current.aborted = true;
    if (status === "running") setStatus("paused");
  }, [status]);

  const reset = useCallback(() => {
    cancelRef.current.aborted = true;
    setResults([]);
    setStatus("idle");
    setError(null);
  }, []);

  return {
    results,
    status,
    error,
    play,
    pause,
    reset,
  };
}
