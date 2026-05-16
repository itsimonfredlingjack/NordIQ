// =====================================================================
// App — surface switcher between Shadow Replay (default, CAB-facing)
// and the employee chat view (one-of-many demos accessible from the
// replay header).
// =====================================================================

import { useState } from "react";
import { ChatView } from "./views/ChatView";
import { ShadowReplayView } from "./views/ShadowReplayView";

type Surface = "replay" | "chat";

export function App() {
  const [surface, setSurface] = useState<Surface>("replay");

  if (surface === "chat") {
    return (
      <div className="relative">
        <ChatView />
        <button
          type="button"
          onClick={() => setSurface("replay")}
          className="fixed left-4 top-4 z-50 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/80 px-3 py-1.5 text-[11px] text-[var(--color-fg-muted)] backdrop-blur transition-colors hover:border-[var(--color-border-2)] hover:text-[var(--color-fg)]"
        >
          ← Back to Shadow Replay
        </button>
      </div>
    );
  }

  return <ShadowReplayView onOpenEmployeeView={() => setSurface("chat")} />;
}
