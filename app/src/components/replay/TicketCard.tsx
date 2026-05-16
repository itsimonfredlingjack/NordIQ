// =====================================================================
// TicketCard — one row in the Shadow Replay queue.
//
// Renders the inbound ticket text on the left, NordIQ's verdict
// (kind/confidence/reason) on the right. While classification is in
// flight, shows a thinking dot. Once cluster-detection has run and
// this ticket is part of a multi-ticket cluster, a small chip is
// added so the audience can see siblings link up.
// =====================================================================

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import type {
  ReplayClassification,
  ReplayKind,
  ReplayTicket,
} from "@/lib/replay/types";

const kindToken: Record<
  ReplayKind,
  { label: string; tone: string; bg: string; icon: typeof CheckCircle2 }
> = {
  deflect: {
    label: "deflect",
    tone: "text-[var(--color-accent)]",
    bg: "bg-[var(--color-accent)]",
    icon: CheckCircle2,
  },
  escalate: {
    label: "escalate",
    tone: "text-[var(--color-warm)]",
    bg: "bg-[var(--color-warm)]",
    icon: UserRound,
  },
  incident: {
    label: "incident",
    tone: "text-[var(--color-alert)]",
    bg: "bg-[var(--color-alert)]",
    icon: AlertOctagon,
  },
  security: {
    label: "security",
    tone: "text-[var(--color-alert)]",
    bg: "bg-[var(--color-alert)]",
    icon: ShieldAlert,
  },
};

export function TicketCard({
  ticket,
  classification,
  pending,
}: {
  ticket: ReplayTicket;
  classification: ReplayClassification | null;
  /** True while NordIQ is still classifying this ticket. */
  pending: boolean;
}) {
  const k = classification ? kindToken[classification.kind] : null;
  const Icon = k?.icon;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="grid grid-cols-[auto_1fr_auto] gap-x-4 border-b border-[var(--color-border)] py-3 last:border-b-0"
    >
      {/* Time + ticket id */}
      <div className="flex w-16 flex-col text-[10.5px] tabular-nums text-[var(--color-fg-subtle)]">
        <span className="font-mono">{ticket.receivedAt}</span>
        <span className="font-mono opacity-70">{ticket.id}</span>
      </div>

      {/* Body */}
      <div className="min-w-0">
        <div className="mb-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-[12.5px] font-medium text-[var(--color-fg)]">
            {ticket.from}
          </span>
          {ticket.team && (
            <span className="text-[11px] text-[var(--color-fg-subtle)]">
              · {ticket.team}
            </span>
          )}
          {ticket.lang === "sv" && (
            <span className="ml-1 rounded-sm border border-[var(--color-border)] px-1 text-[9.5px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
              SV
            </span>
          )}
        </div>
        <p className="text-[13px] leading-snug text-[var(--color-fg-muted)]">
          {ticket.text}
        </p>
        {classification?.reason && (
          <p className="mt-1.5 text-[11.5px] italic leading-snug text-[var(--color-fg-subtle)]">
            NordIQ: {classification.reason}
          </p>
        )}
        {classification?.cluster && (
          <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-[var(--color-alert)]/40 bg-[oklch(20%_0.04_25)] px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-[var(--color-alert)]">
            <AlertTriangle className="h-2.5 w-2.5" />
            cluster · {classification.cluster}
          </span>
        )}
      </div>

      {/* Verdict */}
      <div className="flex w-24 shrink-0 flex-col items-end gap-1">
        {pending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--color-fg-subtle)]" />
        ) : k && Icon ? (
          <>
            <span className={cn("inline-flex items-center gap-1 text-[11.5px] lowercase", k.tone)}>
              <Icon className="h-3 w-3" />
              {k.label}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
              {classification?.confidence ?? ""}
            </span>
          </>
        ) : (
          <span className="text-[10.5px] text-[var(--color-fg-subtle)]">queued</span>
        )}
      </div>
    </motion.li>
  );
}
