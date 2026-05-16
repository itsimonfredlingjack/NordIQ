// =====================================================================
// EvidencePanel — the right-hand readout of a Shadow Replay run.
// Aggregates classifications into the numbers a CAB actually cares
// about: deflection rate, eskaleringskvalitet, incidents formed,
// security-routed, plus a conditional go-live verdict.
// =====================================================================

import {
  AlertOctagon,
  CheckCircle2,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import type { ReplayResult } from "@/lib/replay/types";

export function EvidencePanel({
  results,
  totalQueueSize,
  done,
}: {
  results: ReplayResult[];
  totalQueueSize: number;
  done: boolean;
}) {
  const classified = results.filter((r) => r.classification !== null);
  const deflected = classified.filter((r) => r.classification?.kind === "deflect");
  const escalated = classified.filter((r) => r.classification?.kind === "escalate");
  const incidents = classified.filter((r) => r.classification?.kind === "incident");
  const security = classified.filter((r) => r.classification?.kind === "security");

  const deflectRate =
    classified.length > 0
      ? Math.round((deflected.length / classified.length) * 100)
      : 0;

  // Cluster count = unique non-empty cluster keys among incidents.
  const clusters = new Set(
    incidents
      .map((r) => r.classification?.cluster)
      .filter((c): c is string => Boolean(c)),
  );

  return (
    <aside className="flex h-full w-[320px] shrink-0 flex-col border-l border-[var(--color-border)] bg-[var(--color-bg-2)]/40 p-5">
      <div className="mb-4 text-[10.5px] font-medium uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
        CAB evidence
      </div>

      {/* Headline number */}
      <div className="mb-5">
        <div className="font-display text-[44px] font-medium leading-none text-[var(--color-fg)]">
          {classified.length > 0 ? `${deflectRate}%` : "—"}
        </div>
        <div className="mt-1 text-[12px] text-[var(--color-fg-muted)]">
          {classified.length > 0
            ? `Deflection on ${classified.length} of ${totalQueueSize} tickets`
            : "Awaiting shadow replay"}
        </div>
      </div>

      {/* Breakdown rows */}
      <ul className="mb-5 flex flex-col gap-2.5">
        <BreakdownRow
          icon={CheckCircle2}
          tone="text-[var(--color-accent)]"
          label="Deflected"
          n={deflected.length}
          hint="Handled without first-line triage"
        />
        <BreakdownRow
          icon={UserRound}
          tone="text-[var(--color-warm)]"
          label="Escalated to first-line"
          n={escalated.length}
          hint="Ambiguous or out-of-scope, sent to a human"
        />
        <BreakdownRow
          icon={AlertOctagon}
          tone="text-[var(--color-alert)]"
          label="Incident-flagged"
          n={incidents.length}
          hint={
            clusters.size > 0
              ? `Grouped into ${clusters.size} incident${clusters.size > 1 ? "s" : ""}`
              : "Multi-user pattern, paged on-call"
          }
        />
        <BreakdownRow
          icon={ShieldAlert}
          tone="text-[var(--color-alert)]"
          label="Security routed"
          n={security.length}
          hint="Phishing / credential prompt — security on-call"
        />
      </ul>

      {/* Incident correlation evidence card — the demo moment */}
      {clusters.size > 0 && (
        <CorrelationCard
          incidents={incidents}
          clusters={Array.from(clusters)}
        />
      )}

      {/* Verdict */}
      {done && (
        <div className="mt-auto rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <div className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
            Go-live verdict
          </div>
          <div className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--color-fg)]">
            <strong className="text-[var(--color-warm)]">Conditional go.</strong>{" "}
            {deflectRate >= 40
              ? "In this shadow sample NordIQ met the 40 % deflection floor and routed multi-user and security patterns away from autonomous handling."
              : `Deflection ${deflectRate} % is below the 40 % floor. Recommend one more shadow run before live.`}
          </div>
          <div className="mt-2 text-[11px] text-[var(--color-fg-subtle)]">
            Supports pilot readiness — not full production SLA proof.
          </div>
        </div>
      )}
    </aside>
  );
}

function CorrelationCard({
  incidents,
  clusters,
}: {
  incidents: ReplayResult[];
  clusters: string[];
}) {
  // Only render when at least one cluster has 2+ siblings — that's
  // the "AI did something a rule couldn't" moment we want to point at.
  const interesting = clusters.filter((key) => {
    const siblings = incidents.filter(
      (r) => r.classification?.cluster === key,
    );
    return siblings.length >= 2;
  });
  if (interesting.length === 0) return null;

  return (
    <div className="mb-4 rounded-md border border-[var(--color-alert)]/40 bg-[oklch(20%_0.04_25)] p-3">
      <div className="flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-[0.16em] text-[var(--color-alert)]">
        <AlertOctagon className="h-3 w-3" />
        Incident correlation
      </div>
      <ul className="mt-2 flex flex-col gap-2">
        {interesting.map((key) => {
          const siblings = incidents.filter(
            (r) => r.classification?.cluster === key,
          );
          return (
            <li key={key} className="flex flex-col gap-0.5">
              <div className="text-[12.5px] leading-snug text-[var(--color-fg)]">
                <span className="font-medium">{siblings.length} separate reports</span>{" "}
                <span className="text-[var(--color-fg-subtle)]">→</span>{" "}
                <span className="font-medium text-[var(--color-alert)]">1 P2 candidate</span>
              </div>
              <div className="text-[11px] text-[var(--color-fg-muted)]">
                Cluster: <span className="font-mono">{key}</span> · Action: page
                IT Ops on-call
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function BreakdownRow({
  icon: Icon,
  tone,
  label,
  n,
  hint,
}: {
  icon: typeof CheckCircle2;
  tone: string;
  label: string;
  n: number;
  hint: string;
}) {
  return (
    <li className="flex items-start gap-2.5">
      <Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${tone}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[12.5px] text-[var(--color-fg)]">{label}</span>
          <span className="font-mono text-[13px] tabular-nums text-[var(--color-fg)]">
            {n}
          </span>
        </div>
        <div className="text-[11px] leading-snug text-[var(--color-fg-subtle)]">
          {hint}
        </div>
      </div>
    </li>
  );
}
