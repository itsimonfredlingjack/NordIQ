// =====================================================================
// DevHealthPanel — telemetry surface for the developer running demos.
// Shows per-turn Ollama timings + tag-validity. Renders ONLY in
// `import.meta.env.DEV` so it never ships to a stakeholder build.
// =====================================================================

import { Activity, Check, AlertCircle } from "lucide-react";
import type { ChatMeta } from "@/lib/ollama/adapter";
import { cn } from "@/lib/utils";

export function DevHealthPanel({
  meta,
  tagValid,
}: {
  meta: ChatMeta | null;
  tagValid: boolean | null;
}) {
  if (!import.meta.env.DEV) return null;

  return (
    <div className="border-t border-[var(--color-border)] px-3 py-3">
      <div className="mb-1.5 flex items-center gap-1.5 px-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
        <Activity className="h-3 w-3" />
        Dev — last turn
      </div>
      {!meta ? (
        <div className="px-1.5 text-[10.5px] text-[var(--color-fg-subtle)]">
          No turn yet.
        </div>
      ) : (
        <div className="flex flex-col gap-0.5 px-1.5 text-[10.5px] text-[var(--color-fg-muted)]">
          <Row
            label="Load"
            value={fmtMs(meta.loadMs)}
            warn={meta.loadMs > 1500}
          />
          <Row
            label="Prompt"
            value={`${meta.promptEvalCount}t · ${fmtMs(meta.promptEvalMs)}`}
            hint="cache miss if multi-second"
          />
          <Row
            label="Gen"
            value={`${meta.evalCount}t · ${fmtMs(meta.evalMs)} · ${tokPerSec(meta)} tok/s`}
          />
          <Row label="Total" value={fmtMs(meta.totalMs)} />
          <div className="mt-1 flex items-center justify-between gap-2 rounded-md px-0.5 py-0.5">
            <span className="text-[var(--color-fg-subtle)]">Tag</span>
            <span
              className={cn(
                "inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider",
                tagValid === false
                  ? "text-[var(--color-alert)]"
                  : tagValid === true
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-fg-subtle)]",
              )}
            >
              {tagValid === false ? (
                <>
                  <AlertCircle className="h-2.5 w-2.5" /> missing
                </>
              ) : tagValid === true ? (
                <>
                  <Check className="h-2.5 w-2.5" /> valid
                </>
              ) : (
                "—"
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  warn,
  hint,
}: {
  label: string;
  value: string;
  warn?: boolean;
  hint?: string;
}) {
  return (
    <div
      className="flex items-center justify-between gap-2 px-0.5 py-0.5"
      title={hint ?? ""}
    >
      <span className="text-[var(--color-fg-subtle)]">{label}</span>
      <span
        className={cn(
          "font-mono tabular-nums",
          warn ? "text-[var(--color-warm)]" : "text-[var(--color-fg)]",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function fmtMs(ms: number): string {
  if (ms === 0) return "0";
  if (ms < 1) return "<1ms";
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function tokPerSec(meta: ChatMeta): string {
  if (!meta.evalMs || !meta.evalCount) return "—";
  const tps = meta.evalCount / (meta.evalMs / 1000);
  return tps.toFixed(0);
}
