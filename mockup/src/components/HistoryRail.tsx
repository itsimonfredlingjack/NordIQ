import { Plus, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentOrb } from "@/components/AgentOrb";
import { ModelStatusPill } from "@/components/ModelStatusPill";
import { caseFlows } from "@/lib/mock-data";
import type { StoredChat } from "@/lib/chat-store";
import { cn } from "@/lib/utils";

export function HistoryRail({
  recent,
  activeChatId,
  model,
  modelHealth,
  onNewChat,
  onOpenChat,
  onUseSuggestion,
}: {
  recent: StoredChat[];
  activeChatId: string | null;
  model: string;
  modelHealth: "unknown" | "reachable" | "unreachable";
  onNewChat: () => void;
  onOpenChat: (id: string) => void;
  onUseSuggestion: (prompt: string) => void;
}) {
  return (
    <aside className="hidden w-[228px] shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-2)]/40 md:flex">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 pt-5 pb-3">
        <AgentOrb size={22} />
        <span className="font-display text-[14px] font-semibold tracking-tight text-[var(--color-fg)]">
          NordIQ
        </span>
      </div>

      {/* New chat */}
      <div className="px-3 pb-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onNewChat}
          className="w-full justify-start gap-2 rounded-lg border-[var(--color-border)] hover:bg-[var(--color-surface)]"
        >
          <Plus className="h-3.5 w-3.5" />
          New chat
        </Button>
      </div>

      {/* Recent + suggestions, scrollable */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {recent.length > 0 && (
          <Section icon={MessageCircle} label="Recent">
            <ul className="flex flex-col gap-0.5">
              {recent.map((c) => {
                const active = c.id === activeChatId;
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => onOpenChat(c.id)}
                      className={cn(
                        "block w-full truncate rounded-md px-2.5 py-1.5 text-left text-[12.5px] transition-colors focus-ring",
                        active
                          ? "bg-[var(--color-surface)] text-[var(--color-fg)]"
                          : "text-[var(--color-fg-muted)] hover:bg-[var(--color-surface)]/60 hover:text-[var(--color-fg)]",
                      )}
                      title={c.title}
                    >
                      {c.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </Section>
        )}

        <Section icon={Sparkles} label="Suggestions">
          <ul className="flex flex-col gap-0.5">
            {caseFlows.map((f) => (
              <li key={f.id}>
                <button
                  onClick={() => onUseSuggestion(f.prompt)}
                  className="block w-full truncate rounded-md px-2.5 py-1.5 text-left text-[12.5px] text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-surface)]/60 hover:text-[var(--color-fg)] focus-ring"
                  title={f.prompt}
                >
                  {f.shortLabel}
                </button>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Footer — model status */}
      <div className="border-t border-[var(--color-border)] px-3 py-3">
        <ModelStatusPill model={model} health={modelHealth} />
      </div>
    </aside>
  );
}

function Section({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <div className="mb-1 flex items-center gap-1.5 px-2.5 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      {children}
    </div>
  );
}
