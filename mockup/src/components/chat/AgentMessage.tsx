import { motion } from "framer-motion";
import { AgentOrb } from "@/components/AgentOrb";
import { TicketDraftCard } from "./TicketDraftCard";
import { EscalationBanner } from "./EscalationBanner";
import { KBLinkCard } from "./KBLinkCard";
import { FollowUpCard } from "./FollowUpCard";
import { formatTime } from "@/lib/utils";
import type { ChatMessage, DecisionType } from "@/lib/types";

const stripeColor: Record<DecisionType, string> = {
  "direct-answer": "var(--color-accent)",
  "follow-up": "var(--color-warm)",
  "ticket-created": "var(--color-warm)",
  "incident-flagged": "var(--color-alert)",
};

const stripeLabel: Record<DecisionType, string> = {
  "direct-answer": "answered",
  "follow-up": "asking back",
  "ticket-created": "ticket opened",
  "incident-flagged": "handed off",
};

export function AgentMessage({ msg }: { msg: ChatMessage }) {
  if (msg.author === "system") {
    return (
      <div className="my-1 px-1 text-center text-[11px] text-[var(--color-fg-subtle)]">
        {msg.content}
      </div>
    );
  }

  if (msg.author === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex justify-end"
      >
        <div className="max-w-[78%] rounded-[18px] bg-[var(--color-surface)] px-4 py-2.5 text-[14px] leading-relaxed text-[var(--color-fg)]">
          {msg.content}
        </div>
      </motion.div>
    );
  }

  // agent
  const stripe = msg.classification ? stripeColor[msg.classification] : undefined;
  const label = msg.classification ? stripeLabel[msg.classification] : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex gap-3"
    >
      <AgentOrb size={28} className="mt-0.5" />
      <div className="min-w-0 flex-1">
        {label && (
          <div className="mb-1 flex items-center gap-2 text-[11px] text-[var(--color-fg-subtle)]">
            <span
              className="h-1 w-6 rounded-full"
              style={{ background: stripe }}
            />
            <span className="lowercase tracking-wide">{label}</span>
            <span className="opacity-50 font-mono">
              {formatTime(msg.timestamp)}
            </span>
          </div>
        )}
        <div className="text-[14.5px] leading-relaxed text-[var(--color-fg)]">
          {msg.content}
        </div>

        {msg.attachments?.map((a, i) => {
          if (a.kind === "kb") return <KBLinkCard key={i} sources={a.sources} />;
          if (a.kind === "follow-up")
            return <FollowUpCard key={i} questions={a.questions} />;
          if (a.kind === "ticket")
            return <TicketDraftCard key={i} ticket={a.ticket} />;
          if (a.kind === "escalation")
            return (
              <EscalationBanner
                key={i}
                routedTo={a.routedTo}
                reason={a.reason}
              />
            );
          return null;
        })}
      </div>
    </motion.div>
  );
}
