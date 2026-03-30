import { useCallback } from "react";
import { Outlet, useParams, useNavigate } from "react-router";
import { TooltipProvider } from "cubepath-ui";
import { Sidebar } from "./sidebar";
import type { Chat } from "@/services/api-client";

export interface V2Context {
  activeChatId: string | null;
  setActiveChatId: (id: string) => void;
}

export function AppLayoutV2() {
  const { chatId } = useParams<{ chatId?: string }>();
  const navigate = useNavigate();

  const activeChatId = chatId ?? null;

  const handleSelectChat = useCallback((chat: Chat) => {
    navigate(`/v2/chat/${chat.id}`);
  }, [navigate]);

  const handleNewChat = useCallback(() => {
    navigate("/v2");
  }, [navigate]);

  const setActiveChatId = useCallback((id: string) => {
    navigate(`/v2/chat/${id}`, { replace: true });
  }, [navigate]);

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
