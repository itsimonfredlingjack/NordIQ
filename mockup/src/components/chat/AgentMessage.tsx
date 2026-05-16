import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { AgentOrb, type OrbTone } from "@/components/AgentOrb";
import { TicketDraftCard } from "./TicketDraftCard";
import { EscalationBanner } from "./EscalationBanner";
import { KBLinkCard } from "./KBLinkCard";
import { FollowUpCard } from "./FollowUpCard";
import { ServiceRequestPacketCard } from "@/components/intake/ServiceRequestPacketCard";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
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

const orbTone: Record<DecisionType, OrbTone> = {
  "direct-answer": "default",
  "follow-up": "warm",
  "ticket-created": "warm",
  "incident-flagged": "alert",
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
    return <UserBubble msg={msg} />;
  }

  // agent
  const stripe = msg.classification ? stripeColor[msg.classification] : undefined;
  const label = msg.classification ? stripeLabel[msg.classification] : undefined;
  const tone: OrbTone = msg.classification ? orbTone[msg.classification] : "default";

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex gap-3"
    >
      <AgentOrb size={28} tone={tone} className="mt-0.5" />
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
            {msg.confidence === "low" && (
              <span className="ml-1 inline-flex items-center gap-1 rounded-full border border-[oklch(40%_0.08_70)] bg-[oklch(20%_0.03_70)] px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-[var(--color-warm)]">
                <AlertCircle className="h-2.5 w-2.5" />
                low confidence
              </span>
            )}
          </div>
        )}
        <div className="text-[14.5px] leading-relaxed text-[var(--color-fg)]">
          {msg.content}
        </div>
        {msg.confidence === "low" && (
          <div className="mt-2 flex items-start gap-2 rounded-md border border-[oklch(40%_0.08_70)] bg-[oklch(20%_0.03_70)] px-3 py-2 text-[12px] text-[var(--color-fg-muted)]">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-warm)]" />
            <span>
              I'm not 100% certain about this — if you'd rather a human
              verify, say <em>"open a ticket"</em> and I'll route it.
            </span>
          </div>
        )}

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
          if (a.kind === "packet")
            return <ServiceRequestPacketCard key={i} packet={a.packet} />;
          return null;
        })}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------
// UserBubble — separated so we can host the lightbox sheet's state
// without re-rendering the agent branch unnecessarily.
// ---------------------------------------------------------------------
function UserBubble({ msg }: { msg: ChatMessage }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const images = msg.images ?? [];
  const activeSrc =
    openIdx !== null && images[openIdx]
      ? `data:image/*;base64,${images[openIdx]}`
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex justify-end"
    >
      <div className="flex max-w-[78%] flex-col items-end gap-1.5">
        {images.length > 0 && (
          <div className="flex flex-wrap justify-end gap-1.5">
            {images.map((b64, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setOpenIdx(i)}
                className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent-border)]"
                aria-label={`Open attached image ${i + 1}`}
              >
                <img
                  src={`data:image/*;base64,${b64}`}
                  alt={`Attachment ${i + 1}`}
                  className="block max-h-48 max-w-[180px] object-cover"
                />
              </button>
            ))}
          </div>
        )}
        {msg.content && (
          <div className="rounded-[18px] bg-[var(--color-surface)] px-4 py-2.5 text-[14px] leading-relaxed text-[var(--color-fg)]">
            {msg.content}
          </div>
        )}
      </div>

      <Sheet
        open={openIdx !== null}
        onOpenChange={(o) => {
          if (!o) setOpenIdx(null);
        }}
      >
        <SheetContent side="right" className="bg-[var(--color-bg)]">
          <div className="flex h-full items-center justify-center p-6">
            {activeSrc && (
              <img
                src={activeSrc}
                alt="Attachment full size"
                className="max-h-full max-w-full rounded-md object-contain shadow-[var(--shadow-lg)]"
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </motion.div>
  );
}
