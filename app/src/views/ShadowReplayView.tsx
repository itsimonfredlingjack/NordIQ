// =====================================================================
// ShadowReplayView — the CAB demo surface. Streams the mocked queue
// of yesterday's first-line tickets through NordIQ in shadow mode.
// =====================================================================

import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TicketCard } from "@/components/replay/TicketCard";
import { EvidencePanel } from "@/components/replay/EvidencePanel";
import { useShadowReplay } from "@/hooks/useShadowReplay";
import { REPLAY_QUEUE } from "@/lib/replay/types";

export function ShadowReplayView({
  onOpenEmployeeView,
}: {
  onOpenEmployeeView?: () => void;
}) {
  const { results, status, play, pause, reset } = useShadowReplay();
  const done = status === "done";
  const running = status === "running";

  return (
    <div className="ambient flex h-dvh">
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--color-border)] px-6 py-4">
          <div className="flex items-baseline gap-3">
            <h1 className="font-display text-[18px] font-medium tracking-tight text-[var(--color-fg)]">
              Shadow Replay
            </h1>
            <span className="text-[11.5px] text-[var(--color-fg-subtle)]">
              Yesterday's queue · {results.length} / {REPLAY_QUEUE.length} tickets
            </span>
            <span className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-2)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] breathe" />
              Live classification · nordiq:2 local
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={running ? pause : play}
              disabled={done}
            >
              {running ? (
                <>
                  <Pause className="h-3.5 w-3.5" /> Pause
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />{" "}
                  {results.length > 0 ? "Resume" : "Play"}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={reset}
              disabled={results.length === 0}
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </Button>
            {onOpenEmployeeView && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onOpenEmployeeView}
              >
                Open employee view
              </Button>
            )}
          </div>
        </header>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {results.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <div className="max-w-md">
                  <div className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                    Shadow mode
                  </div>
                  <h2 className="mt-2 font-display text-[24px] leading-tight text-[var(--color-fg)]">
                    Replay a representative first-line sample before go-live.
                  </h2>
                  <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-fg-muted)]">
                    Twelve representative first-line tickets stream through
                    NordIQ. Watch what it would deflect, escalate, group into
                    incidents, and route to security — without touching
                    production.
                  </p>
                  <Button
                    type="button"
                    variant="accent"
                    onClick={play}
                    className="mt-5"
                  >
                    <Play className="h-3.5 w-3.5" /> Play replay
                  </Button>
                </div>
              </div>
            ) : (
              <ul className="mx-auto flex max-w-3xl flex-col">
                {results.map((r) => (
                  <TicketCard
                    key={r.ticket.id}
                    ticket={r.ticket}
                    classification={r.classification}
                    pending={r.classification === null}
                  />
                ))}
              </ul>
            )}
          </div>

          <EvidencePanel
            results={results}
            totalQueueSize={REPLAY_QUEUE.length}
            done={done}
          />
        </div>
      </div>
    </div>
  );
}
