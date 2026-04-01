import { useState, useRef } from "react";
import { useOutletContext } from "react-router";
import { Button } from "cubepath-ui";
import { ArrowDown } from "lucide-react";
import { ChatInputV2 } from "../components/chat-input";
import { MessageListV2 } from "../components/message-list";
import { ScrollContainer } from "../components/scroll-container";
import { useChat } from "../hooks/use-chat";
import type { V2Context } from "@/core/layout/app-layout";

export default function ChatScreen() {
  const { activeChatId: chatId, setActiveChatId: onChatCreated } = useOutletContext<V2Context>();
  const { messages, isStreaming, chatMeta, scrollTrigger, handleSend } = useChat({ chatId, onChatCreated });

  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastUserRef = useRef<HTMLDivElement>(null);

  function handleJumpToBottom() {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {chatMeta && (
        <header className="flex h-12 shrink-0 items-center border-b border-border px-4">
          <h1 className="mx-auto max-w-[720px] w-full text-base font-medium truncate">
            {chatMeta.title}
          </h1>
        </header>
      )}

      {messages.length === 0 ? (
        <MessageListV2 messages={[]} />
      ) : (
        <ScrollContainer
          scrollTrigger={scrollTrigger}
          pinRef={lastUserRef}
          isStreaming={isStreaming}
          onCanScrollDown={setShowScrollBtn}
          containerRef={scrollContainerRef}
        >
          <MessageListV2
            messages={messages}
            isStreaming={isStreaming}
            lastUserRef={lastUserRef}
          />
        </ScrollContainer>
      )}

      {showScrollBtn && (
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-20 left-1/2 -translate-x-1/2 rounded-full bg-background shadow-md z-10"
          onClick={handleJumpToBottom}
        >
          <ArrowDown className="size-4" />
        </Button>
      )}

      <ChatInputV2 onSend={handleSend} disabled={isStreaming} />
    </div>
  );
}
