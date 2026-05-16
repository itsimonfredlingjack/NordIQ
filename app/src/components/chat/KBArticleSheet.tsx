// =====================================================================
// KBArticleSheet — click-through reader for a cited KB article.
//
// Triggered by clicking the chip rendered by KBLinkCard. The chip only
// has the title + reviewedAt from the parsed <NORDIQ source="…" /> tag;
// this component looks up the full body via getArticleByTitle() and
// renders the article with its owner + review metadata, which is what
// makes SLO #6 ("articles must have owner + review date") visible to
// the audience during the demo.
// =====================================================================

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { KBArticle } from "@/lib/kb/articles";
import { Calendar, FileText, User2 } from "lucide-react";

export function KBArticleSheet({
  article,
  open,
  onOpenChange,
}: {
  article: KBArticle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-hidden">
        {article ? (
          <>
            <SheetHeader>
              <div className="flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
                <FileText className="h-3 w-3" />
                <span>{article.id}</span>
                <span className="text-[var(--color-border)]">·</span>
                <span>{article.category}</span>
              </div>
              <SheetTitle>{article.title}</SheetTitle>
              <SheetDescription className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 text-[11.5px]">
                <span className="inline-flex items-center gap-1">
                  <User2 className="h-3 w-3 opacity-70" />
                  Owner: <span className="text-[var(--color-fg)]">{article.owner}</span>
                </span>
                <span className="text-[var(--color-border)]">·</span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3 opacity-70" />
                  Reviewed{" "}
                  <span className="text-[var(--color-fg)]">{article.reviewedAt}</span>
                </span>
                <span className="text-[var(--color-border)]">·</span>
                <span className="text-[var(--color-fg-subtle)]">
                  next review {article.nextReviewDue}
                </span>
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <article className="prose-nordiq max-w-none whitespace-pre-line text-[13.5px] leading-relaxed text-[var(--color-fg-muted)]">
                {article.body}
              </article>
            </div>
            <div className="border-t border-[var(--color-border)] px-6 py-3 text-[11px] text-[var(--color-fg-subtle)]">
              SLO #6 — every KB article the agent may cite must have an owner
              and a review date.
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-[13px] text-[var(--color-fg-muted)]">
            Couldn't resolve this source to a KB article. The agent may have
            cited something outside the current snapshot.
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
