import { cn } from "@/lib/utils";

export function ModelStatusPill({
  model,
  health,
}: {
  model: string;
  health: "unknown" | "reachable" | "unreachable";
}) {
  const dotColor =
    health === "reachable"
      ? "bg-[var(--color-accent)]"
      : health === "unreachable"
        ? "bg-[var(--color-alert)]"
        : "bg-[var(--color-fg-subtle)]";
  const statusLabel =
    health === "reachable"
      ? "online"
      : health === "unreachable"
        ? "offline"
        : "checking";
  return (
    <div className="flex items-center justify-between gap-2 rounded-md px-1.5 py-1.5 text-[11px]">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className={cn(
            "h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
            dotColor,
            health === "reachable" && "breathe",
          )}
        />
        <span className="truncate font-mono text-[var(--color-fg-muted)]">
          {model}
        </span>
      </div>
      <span className="shrink-0 text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
        {statusLabel}
      </span>
    </div>
  );
}
