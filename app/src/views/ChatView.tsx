import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AgentOrb } from "@/components/AgentOrb";
import { AgentMessage } from "@/components/chat/AgentMessage";
import { Composer } from "@/components/Composer";
import { HistoryRail } from "@/components/HistoryRail";
import { SystemHealthBanner } from "@/components/SystemHealthPanel";
import { useNordIQAgent } from "@/hooks/useNordIQAgent";
import { useSystemHealth } from "@/hooks/useSystemHealth";
import { caseFlows, me } from "@/lib/mock-data";

export function ChatView() {
  const agent = useNordIQAgent();
  const { services } = useSystemHealth(agent.model);
  const [composerValue, setComposerValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Re-read recent on each render (cheap — localStorage list of ≤8).
  const recent = useMemo(
    () => agent.recent(),
    // recreate when the active chat or its message count changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [agent.chatId, agent.messages.length, agent.streaming],
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [agent.messages, agent.thinking]);

  const handleSend = (images?: string[]) => {
    const text = composerValue.trim();
    if (!text && (!images || images.length === 0)) return;
    setComposerValue("");
    void agent.send(text, images);
  };

  const handleSuggestion = (prompt: string) => {
    setComposerValue("");
    void agent.send(prompt);
  };

  const handleNewChat = () => {
    setComposerValue("");
    agent.newChat();
  };

  return (
    <div className="ambient flex h-dvh">
      <HistoryRail
        recent={recent}
        activeChatId={agent.chatId}
        services={services}
        lastMeta={agent.lastMeta}
        lastTagValid={agent.lastTagValid}
        onNewChat={handleNewChat}
        onOpenChat={agent.openChat}
        onUseSuggestion={handleSuggestion}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top — minimal, just the user chip */}
        <header className="flex shrink-0 items-center justify-end px-6 py-5">
          <div className="flex items-center gap-2.5 rounded-full pl-1 pr-3">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--color-surface)] text-[11px] font-semibold text-[var(--color-fg)]">
              {me.initials}
            </span>
            <span className="hidden text-[12.5px] font-medium text-[var(--color-fg-muted)] sm:inline">
              {me.name}
            </span>
          </div>
        </header>

        {/* Slim system-health banner — only shows when something is degraded */}
        <div className="px-6">
          <SystemHealthBanner services={services} />
        </div>

        {/* Main */}
        {agent.mode === "hero" ? (
          <main className="flex flex-1 items-center justify-center px-6">
            <div className="flex w-full max-w-2xl flex-col items-center gap-10">
              <div className="flex flex-col items-center gap-4">
                <AgentOrb size={56} className="breathe" />
                <h1 className="text-center font-display text-[36px] font-medium leading-[1.1] tracking-tight text-[var(--color-fg)] sm:text-[44px]">
                  Hi, {me.name.split(" ")[0]}.
                  <br />
                  <span className="text-[var(--color-fg-muted)]">
                    Who's joining NordTech?
                  </span>
                </h1>
              </div>

              <div className="w-full">
                <Composer
                  value={composerValue}
                  onChange={setComposerValue}
                  onSubmit={handleSend}
                  size="lg"
                  placeholder="Paste an email, drop a contract, or describe who's starting"
                  disabled={agent.streaming}
                />
              </div>

              {/* Mobile-only chip row (rail is hidden) */}
              <div className="flex flex-wrap items-center justify-center gap-2 md:hidden">
                {caseFlows.slice(0, 4).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => handleSuggestion(f.prompt)}
                    className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-2)] px-3 py-1.5 text-[12.5px] text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-border-2)] hover:text-[var(--color-fg)]"
                  >
                    {f.shortLabel}
                  </button>
                ))}
              </div>

            </div>
          </main>
        ) : (
          <main className="flex min-h-0 flex-1 flex-col">
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-6 pb-6 pt-2"
            >
              <div className="mx-auto flex max-w-2xl flex-col gap-5">
                {agent.messages.map((m) => (
                  <AgentMessage key={m.id} msg={m} />
                ))}
                {agent.thinking && (
                  <div className="flex items-center gap-3 px-1 py-1">
                    <AgentOrb size={28} active className="mt-0.5" />
                    <div className="flex items-center gap-1">
                      <Dot delay={0} />
                      <Dot delay={0.15} />
                      <Dot delay={0.3} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0 px-6 pb-6 pt-2">
              <div className="mx-auto max-w-2xl">
                <Composer
                  value={composerValue}
                  onChange={setComposerValue}
                  onSubmit={handleSend}
                  placeholder={
                    agent.streaming
                      ? "Streaming…"
                      : "Reply or ask something else"
                  }
                  disabled={agent.streaming}
                />
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.2, repeat: Infinity, delay, ease: "easeInOut" }}
      className="h-1.5 w-1.5 rounded-full bg-[var(--color-fg-subtle)]"
    />
  );
}
