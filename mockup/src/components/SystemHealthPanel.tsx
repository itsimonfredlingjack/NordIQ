import { cn } from "@/lib/utils";
import type { ServiceHealth, Health } from "@/hooks/useSystemHealth";

const dotClass: Record<Health, string> = {
  operational: "bg-[var(--color-accent)]",
  degraded: "bg-[var(--color-warm)]",
  down: "bg-[var(--color-alert)]",
  unknown: "bg-[var(--color-fg-subtle)]",
};

const statusLabel: Record<Health, string> = {
  operational: "ok",
  degraded: "watch",
  down: "down",
  unknown: "—",
};

export function SystemHealthPanel({
  services,
}: {
  services: ServiceHealth[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="px-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
        System health
      </div>
      <ul className="flex flex-col">
        {services.map((s) => (
          <li
            key={s.id}
            className="group flex items-center justify-between gap-2 rounded-md px-1.5 py-1.5 text-[11px] hover:bg-[var(--color-surface)]/50"
            title={s.note ?? ""}
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={cn(
                  "h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
                  dotClass[s.status],
                  s.status === "operational" && "breathe",
                )}
              />
              <div className="flex min-w-0 flex-col leading-tight">
                <span className="text-[11px] text-[var(--color-fg-muted)]">
                  {s.label}
                </span>
                <span className="truncate font-mono text-[10.5px] text-[var(--color-fg)]">
                  {s.detail}
                </span>
              </div>
            </div>
            <span
              className={cn(
                "shrink-0 font-mono text-[10px] uppercase tracking-wider",
                s.status === "operational"
                  ? "text-[var(--color-fg-subtle)]"
                  : s.status === "degraded"
                    ? "text-[var(--color-warm)]"
                    : s.status === "down"
                      ? "text-[var(--color-alert)]"
                      : "text-[var(--color-fg-subtle)]",
              )}
            >
              {statusLabel[s.status]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SystemHealthBanner({
  services,
}: {
  services: ServiceHealth[];
}) {
  // Only render when something is non-operational. Lives at the top of
  // the chat canvas, narrow horizontal strip — never overpowering.
  const issues = services.filter(
    (s) => s.status === "degraded" || s.status === "down",
  );
  if (issues.length === 0) return null;

  const isDown = issues.some((s) => s.status === "down");
  return (
    <div
      className={cn(
        "mx-auto mt-2 w-full max-w-2xl rounded-md border px-3 py-1.5 text-[11.5px]",
        isDown
          ? "border-[oklch(40%_0.1_25)] bg-[oklch(20%_0.04_25)] text-[var(--color-alert)]"
          : "border-[oklch(40%_0.08_70)] bg-[oklch(20%_0.03_70)] text-[var(--color-warm)]",
      )}
    >
      {issues.map((s, i) => (
        <span key={s.id} className="inline-flex items-center gap-1.5">
          {i > 0 && (
            <span className="mx-2 text-[var(--color-fg-subtle)]">·</span>
          )}
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              s.status === "down"
                ? "bg-[var(--color-alert)]"
                : "bg-[var(--color-warm)]",
            )}
          />
          <span className="font-medium">{s.detail}</span>
          <span className="text-[var(--color-fg-muted)]">
            {s.note ?? s.status}
          </span>
        </span>
      ))}
    </div>
  );
}
