// =====================================================================
// KB search — naive keyword scoring, no embeddings.
//
// Why not embeddings: gemma4:e2b doesn't expose embeddings via Ollama
// and pulling a second model just for retrieval is overkill for 8
// articles. A weighted term-frequency match is fast, deterministic,
// and easy to reason about during a CAB demo.
//
// Scoring:
//   title term      ×3
//   keyword term    ×2
//   body term       ×1
// Tie-break: newer reviewedAt wins (rewards fresh KB per Risk R-07).
// Below MIN_SCORE → no match → caller omits KB context, agent
// answers without a `source=` (or offers a ticket).
// =====================================================================

import { KB_ARTICLES, type KBArticle } from "./articles";

const MIN_SCORE = 2;
const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "do",
  "for",
  "from",
  "has",
  "have",
  "i",
  "i'm",
  "im",
  "in",
  "is",
  "it",
  "my",
  "of",
  "on",
  "or",
  "the",
  "to",
  "was",
  "we",
  "what",
  "when",
  "with",
  "you",
  "your",
  "the",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function countOccurrences(haystack: string[], needle: string): number {
  let n = 0;
  for (const t of haystack) if (t === needle) n++;
  return n;
}

export interface KBHit {
  article: KBArticle;
  score: number;
}

export function searchKB(query: string, k = 3): KBHit[] {
  const queryTerms = Array.from(new Set(tokenize(query)));
  if (queryTerms.length === 0) return [];

  const scored: KBHit[] = [];

  for (const article of KB_ARTICLES) {
    const titleTokens = tokenize(article.title);
    const keywordTokens = tokenize(article.keywords.join(" "));
    const bodyTokens = tokenize(article.body);

    let score = 0;
    for (const term of queryTerms) {
      score += countOccurrences(titleTokens, term) * 3;
      score += countOccurrences(keywordTokens, term) * 2;
      score += countOccurrences(bodyTokens, term);
    }

    if (score >= MIN_SCORE) scored.push({ article, score });
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.article.reviewedAt < b.article.reviewedAt ? 1 : -1;
  });

  return scored.slice(0, k);
}

/** Helper for the click-through Sheet — find an article by id. */
export function getArticleById(id: string): KBArticle | undefined {
  return KB_ARTICLES.find((a) => a.id === id);
}

/** Helper for the click-through Sheet — find by title prefix (since the
 * tag's `source="Title | Date"` doesn't include the KB id). Match is
 * case-insensitive, exact title preferred. */
export function getArticleByTitle(title: string): KBArticle | undefined {
  const t = title.trim().toLowerCase();
  return (
    KB_ARTICLES.find((a) => a.title.toLowerCase() === t) ||
    KB_ARTICLES.find((a) => a.title.toLowerCase().startsWith(t)) ||
    KB_ARTICLES.find((a) => t.startsWith(a.title.toLowerCase()))
  );
}
