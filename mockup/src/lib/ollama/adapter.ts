// =====================================================================
// OllamaAdapter
// HTTP client for the local Ollama server. Uses Vite's /ollama proxy
// in dev so we don't have to touch OLLAMA_ORIGINS.
//
// Surfaces three things:
//   - health()      → cheap reachability check, used by ModelStatusPill
//   - listModels()  → for a future model picker
//   - chat()        → AsyncIterable<string> of streamed token chunks
// =====================================================================

const BASE = "/ollama";

export interface OllamaMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OllamaModelInfo {
  name: string;
  size: number;
  parameterSize?: string;
  family?: string;
}

export interface ChatOptions {
  model: string;
  messages: OllamaMessage[];
  signal?: AbortSignal;
  // forwarded to Ollama: temperature, top_p, num_predict, …
  options?: Record<string, number | string | boolean>;
}

// ---------------------------------------------------------------------
// health() — pings /api/tags. Cheap. Returns false on any error.
// ---------------------------------------------------------------------
export async function health(): Promise<{
  reachable: boolean;
  latencyMs: number;
}> {
  const start = performance.now();
  try {
    const r = await fetch(`${BASE}/api/tags`, {
      signal: AbortSignal.timeout(2500),
    });
    return { reachable: r.ok, latencyMs: performance.now() - start };
  } catch {
    return { reachable: false, latencyMs: performance.now() - start };
  }
}

// ---------------------------------------------------------------------
// listModels() — for the picker.
// ---------------------------------------------------------------------
export async function listModels(): Promise<OllamaModelInfo[]> {
  const r = await fetch(`${BASE}/api/tags`);
  if (!r.ok) throw new Error(`listModels failed: ${r.status}`);
  const json = (await r.json()) as {
    models: Array<{
      name: string;
      size: number;
      details?: { parameter_size?: string; family?: string };
    }>;
  };
  return json.models.map((m) => ({
    name: m.name,
    size: m.size,
    parameterSize: m.details?.parameter_size,
    family: m.details?.family,
  }));
}

// ---------------------------------------------------------------------
// chat() — streaming. Yields token chunks (plain strings) as they arrive.
//
// Ollama's /api/chat with stream:true returns NDJSON — one JSON object
// per line, each with `{message: {content: "..."}, done: false}`. The
// final line has done:true and no content. We split on \n and parse.
// ---------------------------------------------------------------------
export async function* chat({
  model,
  messages,
  signal,
  options,
}: ChatOptions): AsyncIterable<string> {
  const r = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    signal,
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      // qwen3.5 ships with thinking on by default — that's a long
      // pre-token phase that makes streaming look frozen. Off for
      // service-desk turns; we want immediate replies.
      think: false,
      options: {
        temperature: 0.4,
        ...options,
      },
    }),
  });

  if (!r.ok || !r.body) {
    const text = await r.text().catch(() => "");
    throw new Error(`Ollama chat failed (${r.status}): ${text.slice(0, 240)}`);
  }

  const reader = r.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;

    // Split on newline; last chunk may be partial — keep it in buffer.
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const obj = JSON.parse(line) as {
          message?: { content?: string };
          done?: boolean;
          error?: string;
        };
        if (obj.error) throw new Error(`Ollama: ${obj.error}`);
        const piece = obj.message?.content;
        if (piece) yield piece;
        if (obj.done) return;
      } catch (e) {
        // Don't kill the stream on a single bad line — Ollama occasionally
        // emits a fragment when the upstream model errors. Re-throw if it's
        // a real error (above), otherwise keep going.
        if (e instanceof Error && e.message.startsWith("Ollama:")) throw e;
      }
    }
  }

  // Flush any trailing buffered fragment (rare).
  if (buffer.trim()) {
    try {
      const obj = JSON.parse(buffer) as { message?: { content?: string } };
      const piece = obj.message?.content;
      if (piece) yield piece;
    } catch {
      // ignore
    }
  }
}
