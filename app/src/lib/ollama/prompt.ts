// =====================================================================
// Message-builder for the chat surface.
//
// The NordIQ persona, language rule, hard rules, vocabulary and tag
// protocol all live in the Modelfile (`nordiq:2`, built from
// `Modelfile.nordiq2`). The frontend sends ONLY user/assistant turns —
// when KB hits exist, the excerpts are PREPENDED to the user's text
// (not a separate system role).
//
// Why prepend, not a system message: tested 2026-05-08 — gemma4:e2b
// drops its tag-protocol discipline when a second system message is
// injected at runtime (it falls into "instructional" markdown mode).
// Embedding the excerpts as a [REFERENCE] block inside the user turn
// keeps the model in the bake-in TONE/TAG PROTOCOL while still letting
// the GROUNDING RULE constrain `source="…"` to real KB titles.
// =====================================================================

import type { OllamaMessage } from "./adapter";
import type { ChatMessage } from "../types";
import { searchKB, type KBHit } from "../kb/search";

export function buildMessages(
  history: ChatMessage[],
  userInput: string,
  currentImages?: string[],
): OllamaMessage[] {
  const out: OllamaMessage[] = [];

  for (const m of history) {
    if (m.author === "user") {
      const msg: OllamaMessage = { role: "user", content: m.content };
      if (m.images?.length) msg.images = m.images;
      out.push(msg);
    } else if (m.author === "agent") {
      // m.content has already had the <NORDIQ /> tag stripped by the
      // streaming parser, so we send back the visible reply only.
      out.push({ role: "assistant", content: m.content });
    }
    // system messages are chat-internal, never forwarded.
  }

  const hits = searchKB(userInput, 3);
  const finalContent =
    hits.length > 0
      ? `${renderKBContext(hits)}\n\n[Question]\n${userInput}`
      : userInput;

  const finalUser: OllamaMessage = { role: "user", content: finalContent };
  if (currentImages?.length) finalUser.images = currentImages;
  out.push(finalUser);
  return out;
}

// ---------------------------------------------------------------------
// renderKBContext — formats the retrieved hits.
// Header line "[KB-NNN · Title · reviewed YYYY-MM-DD]" gives the model
// everything it needs to construct `source="Title | YYYY-MM-DD"`.
// ---------------------------------------------------------------------
function renderKBContext(hits: KBHit[]): string {
  const lines: string[] = [
    "[KNOWLEDGE BASE EXCERPTS — these are the ONLY valid sources for the",
    'source="…" attribute on your <NORDIQ /> tag. If none of them answers',
    "the user, omit source entirely.]",
    "",
  ];

  for (const { article } of hits) {
    lines.push(
      `[${article.id} · ${article.title} · reviewed ${article.reviewedAt}]`,
    );
    lines.push(article.body);
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}
