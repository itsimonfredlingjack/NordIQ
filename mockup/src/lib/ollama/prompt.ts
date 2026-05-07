// =====================================================================
// Message-builder for the chat surface.
//
// The NordIQ persona, language rule, hard rules, vocabulary and tag
// protocol all live in the Modelfile that produces nordiq:1
// (`ollama create nordiq:1 -f Modelfile`). The frontend therefore
// sends ONLY user/assistant turns — no system role, no language pin
// per request. One source of truth for the prompt.
//
// If you swap the model back to a stock `gemma4:e2b` or `qwen3.5:4b`
// you'll need to either rebuild the Modelfile against that base or
// reintroduce a system role here. See the git history for the
// previous implementation.
// =====================================================================

import type { OllamaMessage } from "./adapter";
import type { ChatMessage } from "../types";

export function buildMessages(
  history: ChatMessage[],
  userInput: string,
): OllamaMessage[] {
  const out: OllamaMessage[] = [];

  for (const m of history) {
    if (m.author === "user") {
      out.push({ role: "user", content: m.content });
    } else if (m.author === "agent") {
      // m.content has already had the <NORDIQ /> tag stripped by the
      // streaming parser, so we send back the visible reply only.
      out.push({ role: "assistant", content: m.content });
    }
    // system messages are chat-internal, never forwarded.
  }

  out.push({ role: "user", content: userInput });
  return out;
}
