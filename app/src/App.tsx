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
    return <ChatView onBackToReplay={() => setSurface("replay")} />;
  }

  return <ShadowReplayView onOpenEmployeeView={() => setSurface("chat")} />;
}
