import { useState, useCallback } from "react";
import { Outlet } from "react-router";
import { TooltipProvider } from "cubepath-ui";
import { Sidebar } from "../features/sidebar/sidebar";
import type { Chat } from "../services/api-client";
import type { V2Context } from "../pages/home-v2";

export function AppLayoutV2() {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const handleSelectChat = useCallback((chat: Chat) => {
    setActiveChatId(chat.id);
  }, []);

  const handleNewChat = useCallback((chat: Chat | null) => {
    setActiveChatId(chat?.id ?? null);
  }, []);

  const context: V2Context = { activeChatId, setActiveChatId };

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onOpenSettings={() => {}}
        />
        <main className="flex flex-1 flex-col overflow-hidden">
          <Outlet context={context} />
        </main>
      </div>
    </TooltipProvider>
  );
}
