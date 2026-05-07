// =====================================================================
// chat-store — localStorage-backed conversation history.
// No accounts, no sync, just a small ring buffer of recent chats so
// reload doesn't lose state.
// =====================================================================

import type { ChatMessage } from "./types";

const KEY_CHATS = "nordiq:chats";
const KEY_ACTIVE = "nordiq:active";
const KEY_MODEL = "nordiq:model";

const DEFAULT_MODEL = "qwen3.5:4b";
const MAX_CHATS = 8;

export interface StoredChat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

// ---------------------------------------------------------------------
// Read helpers — defensively parse, never throw on a corrupt blob.
// ---------------------------------------------------------------------
function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / private-mode failures
  }
}

// ---------------------------------------------------------------------
// Chats
// ---------------------------------------------------------------------
export function loadChats(): StoredChat[] {
  const arr = safeRead<StoredChat[]>(KEY_CHATS, []);
  return Array.isArray(arr) ? arr : [];
}

export function loadChat(id: string): StoredChat | null {
  return loadChats().find((c) => c.id === id) ?? null;
}

export function saveChat(chat: StoredChat): void {
  const all = loadChats();
  const idx = all.findIndex((c) => c.id === chat.id);
  if (idx >= 0) {
    all[idx] = chat;
  } else {
    all.unshift(chat);
  }
  // Most recently updated first, then trim to MAX_CHATS.
  all.sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
  safeWrite(KEY_CHATS, all.slice(0, MAX_CHATS));
}

export function deleteChat(id: string): void {
  safeWrite(KEY_CHATS, loadChats().filter((c) => c.id !== id));
  if (getActive() === id) setActive(null);
}

export function clearAllChats(): void {
  safeWrite(KEY_CHATS, []);
  setActive(null);
}

// ---------------------------------------------------------------------
// Active chat id
// ---------------------------------------------------------------------
export function getActive(): string | null {
  try {
    return window.localStorage.getItem(KEY_ACTIVE);
  } catch {
    return null;
  }
}

export function setActive(id: string | null): void {
  try {
    if (id) window.localStorage.setItem(KEY_ACTIVE, id);
    else window.localStorage.removeItem(KEY_ACTIVE);
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------
export function getModel(): string {
  try {
    return window.localStorage.getItem(KEY_MODEL) || DEFAULT_MODEL;
  } catch {
    return DEFAULT_MODEL;
  }
}

export function setModel(name: string): void {
  try {
    window.localStorage.setItem(KEY_MODEL, name);
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------
// Title derivation — first ~40 chars of the first user message,
// trimmed at a word boundary, ellipsised if longer.
// ---------------------------------------------------------------------
export function deriveTitle(messages: ChatMessage[]): string {
  const firstUser = messages.find((m) => m.author === "user");
  if (!firstUser) return "New chat";
  const raw = firstUser.content.trim().replace(/\s+/g, " ");
  if (raw.length <= 40) return raw;
  const cut = raw.slice(0, 40);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 16 ? cut.slice(0, lastSpace) : cut) + "…";
}

// ---------------------------------------------------------------------
// Convenience: make a fresh chat shell.
// ---------------------------------------------------------------------
export function newChat(): StoredChat {
  const now = new Date().toISOString();
  return {
    id:
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: "New chat",
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
}
