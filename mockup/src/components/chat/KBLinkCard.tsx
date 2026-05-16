import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { KBSource } from "@/lib/types";
import { getArticleByTitle } from "@/lib/kb/search";
import { KBArticleSheet } from "./KBArticleSheet";

// Quiet inline citation row — not a card. Each chip resolves the
// `<NORDIQ source="Title | Date" />` title against the in-process
// KB. If the title maps to an article we have, the chip becomes a
// button that opens the article body in a side Sheet (so the user can
// see what the agent based its answer on, plus owner + review date for
// SLO #6). If the title doesn't resolve, the chip degrades gracefully
// to a plain label — Phase 4 grounding rule should make that a rare
// path.
export function KBLinkCard({ sources }: { sources: KBSource[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const active = openIdx !== null ? sources[openIdx] : null;
  const article = active ? getArticleByTitle(active.title) ?? null : null;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11.5px] text-[var(--color-fg-subtle)]">
      <span>Source</span>
      {sources.map((s, i) => {
        const resolvable = !!getArticleByTitle(s.title);
        return (
          <button
            key={i}
            type="button"
            disabled={!resolvable}
            onClick={() => setOpenIdx(i)}
            className="group inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-2)] px-2 py-0.5 text-[var(--color-fg-muted)] transition-colors enabled:hover:border-[var(--color-accent-border)] enabled:hover:text-[var(--color-fg)] disabled:cursor-default disabled:opacity-70"
          >
            {s.title}
            {resolvable && (
              <ArrowUpRight className="h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100" />
            )}
          </button>
        );
      })}
      <KBArticleSheet
        article={article}
        open={openIdx !== null}
        onOpenChange={(o) => {
          if (!o) setOpenIdx(null);
        }}
      />
    </div>
  );
}
