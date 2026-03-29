import { useEffect, useRef } from "react";
import { ChatBubble, Avatar, AvatarFallback } from "cubepath-ui";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

interface MessageListProps {
  messages: ChatMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messages[messages.length - 1]?.content]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="text-4xl">
          <Avatar className="size-16">
            <AvatarFallback className="text-2xl">CP</AvatarFallback>
          </Avatar>
        </div>
        <h2 className="text-lg font-semibold">Welcome to CubePath</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Manage your cloud infrastructure through natural language. Deploy servers,
          check status, scale resources — just ask.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
      {messages.map((msg) => (
        <ChatBubble
          key={msg.id}
          variant={msg.role}
          timestamp={msg.timestamp}
          isLoading={msg.isStreaming && msg.content === ""}
          avatar={
            msg.role === "assistant" ? (
              <Avatar className="size-8">
                <AvatarFallback className="text-xs">CP</AvatarFallback>
              </Avatar>
            ) : undefined
          }
        >
          {msg.isStreaming && msg.content === "" ? undefined : msg.content}
        </ChatBubble>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
