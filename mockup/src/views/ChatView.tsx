import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { AgentOrb } from "@/components/AgentOrb";
import { AgentMessage } from "@/components/chat/AgentMessage";
import { Composer } from "@/components/Composer";
import { Button } from "@/components/ui/button";
import { caseFlows, me } from "@/lib/mock-data";
import type { ChatMessage, CaseFlow } from "@/lib/types";

type Mode = "hero" | "playing";

export function ChatView() {
  const [mode, setMode] = useState<Mode>("hero");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [composerValue, setComposerValue] = useState("");
  const [thinking, setThinking] = useState(false);
  const scriptRef = useRef<{ flow: CaseFlow; idx: number } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const startFlow = (flow: CaseFlow) => {
    scriptRef.current = { flow, idx: 1 };
    setMessages([flow.steps[0]]);
    setMode("playing");
    advanceScript();
  };

  // Auto-play remaining steps. Agent steps show a thinking pulse, user
  // steps appear after a typing pause. Demo is passive.
  const advanceScript = () => {
    const s = scriptRef.current;
    if (!s) return;
    const next = s.flow.steps[s.idx];
    if (!next) return;

    if (next.author === "agent") {
      setThinking(true);
      window.setTimeout(() => {
        setThinking(false);
        setMessages((prev) => [...prev, next]);
        s.idx += 1;
        window.setTimeout(advanceScript, 700);
      }, 950);
    } else {
      // user message — short pause to feel natural, no thinking dots
      window.setTimeout(() => {
        setMessages((prev) => [...prev, next]);
        s.idx += 1;
        window.setTimeout(advanceScript, 500);
      }, 1200);
    }
  };

  const handleSend = () => {
    if (!composerValue.trim()) return;
    // Free chat — echo user, agent gives a soft fallback. Scripted flows
    // are auto-played from chips; the composer is just for free messages.
    scriptRef.current = null;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      author: "user",
      content: composerValue.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setComposerValue("");
    setMode("playing");
    setThinking(true);
    window.setTimeout(() => {
      setThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          author: "agent",
          timestamp: new Date().toISOString(),
          classification: "follow-up",
          content:
            "This mockup only plays the three scripted scenarios above. Pick one of the chips for a complete walk-through.",
        },
      ]);
    }, 900);
  };

  const reset = () => {
    scriptRef.current = null;
    setMessages([]);
    setMode("hero");
    setComposerValue("");
    setThinking(false);
  };

  return (
    <div className="ambient flex h-dvh flex-col">
      {/* Top — minimal brand left, profile right */}
      <header className="flex shrink-0 items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <AgentOrb size={22} active={mode === "playing"} />
          <span className="font-display text-[15px] font-semibold tracking-tight text-[var(--color-fg)]">
            NordIQ
          </span>
        </div>
        <div className="flex items-center gap-3">
          {mode === "playing" && (
            <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              New chat
            </Button>
          )}
          <div className="flex items-center gap-2.5 rounded-full pl-1 pr-3">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--color-surface)] text-[11px] font-semibold text-[var(--color-fg)]">
              {me.initials}
            </span>
            <span className="hidden text-[12.5px] font-medium text-[var(--color-fg-muted)] sm:inline">
              {me.name}
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      {mode === "hero" ? (
          <main className="flex flex-1 items-center justify-center px-6">
            <div className="flex w-full max-w-2xl flex-col items-center gap-10">
              <div className="flex flex-col items-center gap-4">
                <AgentOrb size={56} className="breathe" />
                <h1 className="text-center font-display text-[36px] font-medium leading-[1.1] tracking-tight text-[var(--color-fg)] sm:text-[44px]">
                  Hi, {me.name.split(" ")[0]}.
                  <br />
                  <span className="text-[var(--color-fg-muted)]">
                    What do you need today?
                  </span>
                </h1>
              </div>

              <div className="w-full">
                <Composer
                  value={composerValue}
                  onChange={setComposerValue}
                  onSubmit={handleSend}
                  size="lg"
                  placeholder="Ask NordIQ — passwords, access, devices, anything"
                />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {caseFlows.map((f) => (
                  <Button
                    key={f.id}
                    variant="chip"
                    size="sm"
                    onClick={() => startFlow(f)}
                  >
                    {f.shortLabel}
                  </Button>
                ))}
              </div>
            </div>
          </main>
        ) : (
          <main
            className="flex min-h-0 flex-1 flex-col"
          >
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-6 pb-6 pt-2"
            >
              <div className="mx-auto flex max-w-2xl flex-col gap-5">
                {messages.map((m) => (
                  <AgentMessage key={m.id} msg={m} />
                ))}
                {thinking && (
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
                  placeholder="Reply or ask something else"
                />
              </div>
            </div>
          </main>
        )}
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
