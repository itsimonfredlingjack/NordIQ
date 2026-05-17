// =====================================================================
// ServiceRequestPacketCard — inline render of an IT-intake packet
// produced by NordIQ. Lives below the agent's prose reply, like the
// other attachment cards (KBLinkCard, FollowUpCard, etc).
//
// Two surfaces:
//   - Compact card in the chat (this file's default export).
//   - Click anywhere → opens a side Sheet with the full packet
//     (ServiceRequestPacketSheet, separate file).
// =====================================================================

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  ServiceRequestPacket,
  RequestStatus,
} from "@/lib/intake/types";
import { ServiceRequestPacketSheet } from "./ServiceRequestPacketSheet";

const statusBadge: Record<RequestStatus, { label: string; tone: string }> = {
  ready: { label: "ready", tone: "text-[var(--color-accent)]" },
  needs_input: { label: "needs input", tone: "text-[var(--color-warm)]" },
  needs_approval: {
    label: "awaiting approval",
    tone: "text-[var(--color-warm)]",
  },
  blocked: { label: "blocked", tone: "text-[var(--color-alert)]" },
};

export function ServiceRequestPacketCard({
  packet,
}: {
  packet: ServiceRequestPacket;
}) {
  const [open, setOpen] = useState(false);
  const ready = packet.requests.filter((r) => r.status === "ready").length;
  const total = packet.requests.length;
  const blocking = packet.requests.filter(
    (r) => r.status === "blocked" || r.status === "needs_approval" || r.status === "needs_input",
  ).length;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group mt-2 flex w-full flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-3 text-left transition-colors hover:border-[var(--color-border-2)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <FileText className="h-3.5 w-3.5 shrink-0 text-[var(--color-fg-subtle)]" />
            <span className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
              IT intake packet
            </span>
            <span className="text-[10.5px] text-[var(--color-fg-subtle)]/60">
              {packet.id}
            </span>
          </div>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--color-fg-subtle)] transition-transform group-hover:translate-x-0.5" />
        </div>

        <div className="text-[13.5px] font-medium leading-snug text-[var(--color-fg)]">
          {packet.subject}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 text-[11.5px] text-[var(--color-fg-muted)]">
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-[var(--color-accent)]" />
            {ready}/{total} ready
          </span>
          {blocking > 0 && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3 text-[var(--color-warm)]" />
              {blocking} blocked
            </span>
          )}
          {packet.missing.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <CircleAlert className="h-3 w-3 text-[var(--color-warm)]" />
              {packet.missing.length} missing
            </span>
          )}
          {packet.risks.some((r) => r.severity === "block") && (
            <span className="inline-flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-[var(--color-alert)]" />
              risks
            </span>
          )}
        </div>

        <ul className="flex flex-col gap-0.5 pt-1">
          {packet.requests.slice(0, 5).map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between gap-2 text-[11.5px] text-[var(--color-fg-muted)]"
            >
              <span className="truncate">
                <span className="font-mono text-[10.5px] text-[var(--color-fg-subtle)] mr-1.5">
                  {r.id}
                </span>
                {r.title}
              </span>
              <span
                className={cn(
                  "shrink-0 font-mono text-[10px] uppercase tracking-wider",
                  statusBadge[r.status].tone,
                )}
              >
                {statusBadge[r.status].label}
              </span>
            </li>
          ))}
        </ul>
      </button>

      <ServiceRequestPacketSheet
        packet={packet}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
