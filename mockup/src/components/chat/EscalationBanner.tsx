import { ArrowRight } from "lucide-react";

// Calm escalation marker — no siren, no big tinted card.
// A horizontal rule + small caption explains what happened.
export function EscalationBanner({
  routedTo,
  reason,
}: {
  routedTo: string;
  reason: string;
}) {
  return (
    <div className="mt-3 flex items-center gap-2.5 text-[11.5px] text-[var(--color-fg-muted)]">
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: "var(--color-alert)" }}
      />
      <span>Handed off to</span>
      <span className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-2)] px-2 py-0.5 font-medium text-[var(--color-fg)]">
        {routedTo}
      </span>
      <ArrowRight className="h-3 w-3 text-[var(--color-fg-subtle)]" />
      <span className="truncate">{reason}</span>
    </div>
  );
}
