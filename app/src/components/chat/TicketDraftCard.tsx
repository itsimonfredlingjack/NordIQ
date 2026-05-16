import { ArrowUpRight } from "lucide-react";
import type { MiniTicket } from "@/lib/types";

// Slim ticket marker — no field grid, just identity + summary + action.
export function TicketDraftCard({ ticket }: { ticket: MiniTicket }) {
  return (
    <div className="mt-3 flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-2)] px-3.5 py-2.5">
      <span
        className="grid h-7 w-7 place-items-center rounded-lg text-[10px] font-mono"
        style={{
          background: "oklch(28% 0.04 70)",
          color: "var(--color-warm)",
        }}
      >
        {ticket.priority}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-[10.5px] text-[var(--color-fg-subtle)]">
          <span className="font-mono">{ticket.id}</span>
          <span>·</span>
          <span>Routed to {ticket.routedTo}</span>
        </div>
        <div className="truncate text-[13px] font-medium text-[var(--color-fg)]">
          {ticket.summary}
        </div>
      </div>
      <a
        href="#"
        className="group inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11.5px] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
      >
        View
        <ArrowUpRight className="h-3 w-3 opacity-60 transition-opacity group-hover:opacity-100" />
      </a>
    </div>
  );
}
