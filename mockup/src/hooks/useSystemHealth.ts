// =====================================================================
// useSystemHealth — health state for the three things NordIQ depends on:
//   1. Local model (real ping via OllamaAdapter.health())
//   2. CloudFrame Nordic — hosting (mocked, occasional degradation)
//   3. Lumeon API — LLM failover (mocked, occasional degradation)
//
// Mocked status flips serve the demo: every ~3 min one supplier flips
// to "degraded" for ~45s, then recovers. Deterministic per minute so
// the user can predict it during a walk-through.
// =====================================================================

import { useEffect, useState } from "react";
import * as ollama from "@/lib/ollama/adapter";

export type Health = "operational" | "degraded" | "down" | "unknown";

export interface ServiceHealth {
  id: "model" | "hosting" | "llm";
  label: string;
  detail: string;
  status: Health;
  note?: string;
}

const SUPPLIER_PERIOD_MS = 3 * 60 * 1000; // 3 min cycles
const SUPPLIER_DEGRADE_MS = 45 * 1000; // 45s degraded

function mockSupplierStatus(now: number, offset: number): Health {
  // Each supplier degrades for SUPPLIER_DEGRADE_MS at the start of its
  // own cycle, then operational the rest of the cycle.
  const t = (now + offset) % SUPPLIER_PERIOD_MS;
  return t < SUPPLIER_DEGRADE_MS ? "degraded" : "operational";
}

export function useSystemHealth(model: string) {
  const [services, setServices] = useState<ServiceHealth[]>([
    {
      id: "model",
      label: "Model",
      detail: model,
      status: "unknown",
    },
    {
      id: "hosting",
      label: "Hosting",
      detail: "CloudFrame Nordic",
      status: "operational",
    },
    {
      id: "llm",
      label: "LLM API",
      detail: "Lumeon (failover)",
      status: "operational",
      note: "Idle — local model active",
    },
  ]);

  // Real model ping every 30s + look up the underlying base model
  // once per model change so the demo can show "nordiq:1 · gemma4:e2b".
  useEffect(() => {
    let cancelled = false;

    const lookupBase = async () => {
      const details = await ollama.getModelDetails(model);
      if (cancelled) return;
      const detail = details.base
        ? `${model} · ${details.base}`
        : model;
      setServices((prev) =>
        prev.map((s) => (s.id === "model" ? { ...s, detail } : s)),
      );
    };

    const ping = async () => {
      const h = await ollama.health();
      if (cancelled) return;
      setServices((prev) =>
        prev.map((s) =>
          s.id === "model"
            ? { ...s, status: h.reachable ? "operational" : "down" }
            : s,
        ),
      );
    };

    void lookupBase();
    void ping();
    const id = window.setInterval(ping, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [model]);

  // Mocked supplier rotation every 5s (cheap re-eval; status only
  // changes on cycle boundaries).
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      setServices((prev) =>
        prev.map((s) => {
          if (s.id === "hosting") {
            const status = mockSupplierStatus(now, 0);
            return {
              ...s,
              status,
              note:
                status === "degraded"
                  ? "Elevated latency in EU-N region"
                  : undefined,
            };
          }
          if (s.id === "llm") {
            const status = mockSupplierStatus(now, 90 * 1000);
            return {
              ...s,
              status,
              note:
                status === "degraded"
                  ? "Token rate limited — fallback ready"
                  : "Idle — local model active",
            };
          }
          return s;
        }),
      );
    };
    tick();
    const id = window.setInterval(tick, 5_000);
    return () => window.clearInterval(id);
  }, []);

  const overall: Health = services.some((s) => s.status === "down")
    ? "down"
    : services.some((s) => s.status === "degraded")
      ? "degraded"
      : services.every((s) => s.status === "operational")
        ? "operational"
        : "unknown";

  return { services, overall };
}
