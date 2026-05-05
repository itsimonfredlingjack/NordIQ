import { ArrowUpRight } from "lucide-react";
import type { KBSource } from "@/lib/types";

// Quiet inline citation row — not a card.
export function KBLinkCard({ sources }: { sources: KBSource[] }) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11.5px] text-[var(--color-fg-subtle)]">
      <span>Source</span>
      {sources.map((s, i) => (
        <a
          key={i}
          href="#"
          className="group inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-2)] px-2 py-0.5 text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-accent-border)] hover:text-[var(--color-fg)]"
        >
          {s.title}
          <ArrowUpRight className="h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100" />
        </a>
      ))}
    </div>
  );
}
