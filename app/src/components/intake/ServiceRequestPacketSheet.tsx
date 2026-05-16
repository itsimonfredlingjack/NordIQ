// =====================================================================
// ServiceRequestPacketSheet — full read of the IT-intake packet,
// opened from the inline card. This is the artifact the CAB demo
// points at and says "this came out of NordIQ in 4 minutes".
// =====================================================================

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Clock, FileText } from "lucide-react";
import type {
  ServiceRequestPacket,
  RequestStatus,
  IntakeRisk,
} from "@/lib/intake/types";

const statusToken: Record<RequestStatus, { label: string; tone: string }> = {
  ready: { label: "ready", tone: "text-[var(--color-accent)]" },
  needs_input: { label: "needs input", tone: "text-[var(--color-warm)]" },
  needs_approval: {
    label: "awaiting approval",
    tone: "text-[var(--color-warm)]",
  },
  blocked: { label: "blocked", tone: "text-[var(--color-alert)]" },
};

const dotBg: Record<RequestStatus, string> = {
  ready: "bg-[var(--color-accent)]",
  needs_input: "bg-[var(--color-warm)]",
  needs_approval: "bg-[var(--color-warm)]",
  blocked: "bg-[var(--color-alert)]",
};

const riskTone: Record<IntakeRisk["severity"], string> = {
  info: "text-[var(--color-fg-muted)]",
  warn: "text-[var(--color-warm)]",
  block: "text-[var(--color-alert)]",
};

export function ServiceRequestPacketSheet({
  packet,
  open,
  onOpenChange,
}: {
  packet: ServiceRequestPacket;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-hidden">
        <SheetHeader>
          <div className="flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
            <FileText className="h-3 w-3" />
            <span>IT intake packet</span>
            <span className="text-[var(--color-border)]">·</span>
            <span>{packet.id}</span>
          </div>
          <SheetTitle>{packet.subject}</SheetTitle>
          <SheetDescription className="pt-0.5">
            {packet.intent}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Verdict bar */}
          <div
            className={cn(
              "mb-5 flex items-center gap-2 rounded-md border px-3 py-2 text-[12.5px]",
              packet.readyToSubmit
                ? "border-[oklch(40%_0.08_175)] bg-[oklch(20%_0.03_175)] text-[var(--color-accent)]"
                : "border-[oklch(40%_0.08_70)] bg-[oklch(20%_0.03_70)] text-[var(--color-warm)]",
            )}
          >
            {packet.readyToSubmit ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <Clock className="h-3.5 w-3.5" />
            )}
            <span>
              {packet.readyToSubmit
                ? "All requests ready — packet can be submitted."
                : "Packet is held — input or approval required before submit."}
            </span>
          </div>

          {/* Service requests */}
          <Section title="Service requests">
            <ul className="flex flex-col gap-3">
              {packet.requests.map((r) => {
                const dotTone = statusToken[r.status].tone;
                return (
                  <li
                    key={r.id}
                    className="grid grid-cols-[auto_1fr] gap-x-3 border-b border-[var(--color-border)] pb-3 last:border-b-0 last:pb-0"
                  >
                    <span className="pt-0.5 font-mono text-[10.5px] tabular-nums text-[var(--color-fg-subtle)]">
                      {r.id}
                    </span>
                    <div className="flex min-w-0 flex-col gap-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[13.5px] font-medium leading-snug text-[var(--color-fg)]">
                          {r.title}
                        </span>
                        <span
                          className={cn(
                            "inline-flex shrink-0 items-center gap-1.5 text-[11px] lowercase",
                            dotTone,
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              dotBg[r.status],
                            )}
                          />
                          {statusToken[r.status].label}
                        </span>
                      </div>
                      <p className="text-[12.5px] leading-relaxed text-[var(--color-fg-muted)]">
                        {r.body}
                      </p>
                      <div className="text-[11.5px] text-[var(--color-fg-subtle)]">
                        {r.routedTo}
                        {r.approvers.length > 0 && (
                          <>
                            {" · awaiting "}
                            <span className="text-[var(--color-fg-muted)]">
                              {r.approvers.join(", ")}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Section>

          {/* Missing fields */}
          {packet.missing.length > 0 && (
            <Section title="Missing input">
              <ul className="flex flex-col gap-2">
                {packet.missing.map((m, i) => (
                  <li
                    key={i}
                    className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-2)] px-3 py-2"
                  >
                    <div className="text-[12.5px] font-medium text-[var(--color-fg)]">
                      {m.field}
                    </div>
                    <div className="text-[11.5px] text-[var(--color-fg-muted)]">
                      {m.why}
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Risks */}
          {packet.risks.length > 0 && (
            <Section title="Risks &amp; flags">
              <ul className="flex flex-col gap-2">
                {packet.risks.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-2)] px-3 py-2"
                  >
                    <AlertTriangle
                      className={cn(
                        "mt-0.5 h-3.5 w-3.5 shrink-0",
                        riskTone[r.severity],
                      )}
                    />
                    <div className="min-w-0">
                      <div className="text-[12.5px] font-medium text-[var(--color-fg)]">
                        {r.label}
                      </div>
                      <div className="text-[11.5px] text-[var(--color-fg-muted)]">
                        {r.detail}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        <div className="border-t border-[var(--color-border)] px-6 py-3 text-[11px] text-[var(--color-fg-subtle)]">
          Generated by NordIQ — review before submit. Each request is routed
          to the team shown; approvals are surfaced inline.
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="mb-2 text-[10.5px] font-medium uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
        {title}
      </div>
      {children}
    </div>
  );
}
