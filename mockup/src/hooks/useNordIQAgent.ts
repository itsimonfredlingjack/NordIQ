// =====================================================================
// useNordIQAgent — orchestrates the chat surface.
// Owns: messages, streaming state, current chat id, current model,
// model health. Drives OllamaAdapter and persists every turn to
// chat-store.
// =====================================================================

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as ollama from "@/lib/ollama/adapter";
import { buildMessages } from "@/lib/ollama/prompt";
import { extract, tagToAttachments } from "@/lib/ollama/parse";
import * as store from "@/lib/chat-store";
import type { ChatMessage } from "@/lib/types";

type Mode = "hero" | "playing";

interface AgentState {
  mode: Mode;
  chatId: string | null;
  messages: ChatMessage[];
  streaming: boolean;
  thinking: boolean; // pre-first-token
  error: string | null;
  model: string;
  modelHealth: "unknown" | "reachable" | "unreachable";
}

export function useNordIQAgent() {
  const [state, setState] = useState<AgentState>(() => {
    const activeId = store.getActive();
    const active = activeId ? store.loadChat(activeId) : null;
    return {
      mode: active && active.messages.length > 0 ? "playing" : "hero",
      chatId: active?.id ?? null,
      messages: active?.messages ?? [],
      streaming: false,
      thinking: false,
      error: null,
      model: store.getModel(),
      modelHealth: "unknown",
    };
  });

  const abortRef = useRef<AbortController | null>(null);

  // -------------------------------------------------------------------
  // Health pinger — once on mount, then every 30s.
  // -------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    const ping = async () => {
      const h = await ollama.health();
      if (cancelled) return;
      setState((s) => ({
        ...s,
        modelHealth: h.reachable ? "reachable" : "unreachable",
      }));
    };
    ping();
    const id = window.setInterval(ping, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  // -------------------------------------------------------------------
  // Persist on every meaningful change.
  // -------------------------------------------------------------------
  const persist = useCallback(
    (chatId: string, messages: ChatMessage[]) => {
      const existing = store.loadChat(chatId);
      const now = new Date().toISOString();
      const stored: store.StoredChat = {
        id: chatId,
        title: store.deriveTitle(messages),
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        messages,
      };
      store.saveChat(stored);
      store.setActive(chatId);
    },
    [],
  );

  // -------------------------------------------------------------------
  // send() — main entry. Append user msg, stream agent reply, persist.
  // -------------------------------------------------------------------
  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      // Cancel any in-flight stream.
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        author: "user",
        content: trimmed,
        timestamp: new Date().toISOString(),
      };

      const agentId = `a-${Date.now() + 1}`;
      const agentPlaceholder: ChatMessage = {
        id: agentId,
        author: "agent",
        content: "",
        timestamp: new Date().toISOString(),
      };

      // Snapshot the history we'll feed the model. Note: we send the
      // history BEFORE adding the new user msg as the array, then
      // pass `trimmed` separately to buildMessages.
      let priorMessages: ChatMessage[] = [];
      let activeId: string;

      setState((s) => {
        priorMessages = s.messages;
        activeId =
          s.chatId ??
          (typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `c-${Date.now()}`);
        return {
          ...s,
          mode: "playing",
          chatId: activeId,
          messages: [...s.messages, userMsg, agentPlaceholder],
          streaming: true,
          thinking: true,
          error: null,
        };
      });

      // We can't read the just-set state synchronously; rebuild the
      // chatId locally. (setState callback ran; activeId is bound.)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const chatId = activeId!;

      try {
        let buf = "";
        let firstToken = true;
        const stream = ollama.chat({
          model: state.model,
          messages: buildMessages(priorMessages, trimmed),
          signal: abortRef.current.signal,
        });

        for await (const piece of stream) {
          buf += piece;
          if (firstToken) {
            firstToken = false;
            setState((s) => ({ ...s, thinking: false }));
          }
          const { visible, tag } = extract(buf);
          // Update the placeholder live. Hide tag fragment from view.
          setState((s) => ({
            ...s,
            messages: s.messages.map((m) =>
              m.id === agentId
                ? {
                    ...m,
                    content: visible,
                    classification: tag?.classification ?? m.classification,
                    confidence: tag?.confidence ?? m.confidence,
                    attachments: tag ? tagToAttachments(tag) : m.attachments,
                  }
                : m,
            ),
          }));
        }

        // Final pass — make sure we've extracted the tag even if it
        // landed in the very last chunk.
        const final = extract(buf);
        setState((s) => {
          const updated = s.messages.map((m) =>
            m.id === agentId
              ? {
                  ...m,
                  content: final.visible,
                  classification: final.tag?.classification ?? m.classification,
                  confidence: final.tag?.confidence ?? m.confidence,
                  attachments: final.tag
                    ? tagToAttachments(final.tag)
                    : m.attachments,
                }
              : m,
          );
          persist(chatId, updated);
          return {
            ...s,
            messages: updated,
            streaming: false,
            thinking: false,
          };
        });
      } catch (e) {
        if ((e as Error).name === "AbortError") {
          setState((s) => ({ ...s, streaming: false, thinking: false }));
          return;
        }
        const msg = e instanceof Error ? e.message : String(e);
        setState((s) => {
          // Replace placeholder with an error system message.
          const without = s.messages.filter((m) => m.id !== agentId);
          const errMsg: ChatMessage = {
            id: `s-${Date.now()}`,
            author: "system",
            content: friendlyError(msg),
            timestamp: new Date().toISOString(),
          };
          return {
            ...s,
            messages: [...without, errMsg],
            streaming: false,
            thinking: false,
            error: msg,
          };
        });
      }
    },
    [state.model, persist],
  );

  // -------------------------------------------------------------------
  // newChat() — drop current and return to hero.
  // -------------------------------------------------------------------
  const newChat = useCallback(() => {
    abortRef.current?.abort();
    store.setActive(null);
    setState((s) => ({
      ...s,
      mode: "hero",
      chatId: null,
      messages: [],
      streaming: false,
      thinking: false,
      error: null,
    }));
  }, []);

  // -------------------------------------------------------------------
  // openChat() — load a stored chat into view.
  // -------------------------------------------------------------------
  const openChat = useCallback((id: string) => {
    const chat = store.loadChat(id);
    if (!chat) return;
    abortRef.current?.abort();
    store.setActive(id);
    setState((s) => ({
      ...s,
      mode: "playing",
      chatId: id,
      messages: chat.messages,
      streaming: false,
      thinking: false,
      error: null,
    }));
  }, []);

  // -------------------------------------------------------------------
  // setModel() — persists across reloads.
  // -------------------------------------------------------------------
  const setModel = useCallback((name: string) => {
    store.setModel(name);
    setState((s) => ({ ...s, model: name }));
  }, []);

  // -------------------------------------------------------------------
  // deriveRecent — re-read store on demand. Used by HistoryRail.
  // -------------------------------------------------------------------
  const recent = useMemo(
    () => () => store.loadChats(),
    // intentionally NOT memoised across renders — we want fresh reads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.messages, state.chatId],
  );

  return {
    ...state,
    send,
    newChat,
    openChat,
    setModel,
    recent,
  };
}

function friendlyError(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes("failed to fetch") || lower.includes("networkerror")) {
    return "Can't reach the local model. Make sure Ollama is running (try `ollama serve` in a terminal).";
  }
  if (lower.includes("model") && lower.includes("not found")) {
    return `Model not found. Run \`ollama pull qwen3.5:4b\` and try again.`;
  }
  if (lower.includes("aborted")) {
    return "Stopped.";
  }
  return `Something went wrong talking to the model. ${raw.slice(0, 140)}`;
}
