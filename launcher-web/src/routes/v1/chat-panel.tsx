import { useState, useCallback } from "react";
import { useMcpClient } from "@/providers/app-provider";
import { ChatInput } from "./chat-input";
import { MessageList, type ChatMessage } from "./message-list";

function timestamp() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

let nextId = 0;
function genId() {
  return `msg-${++nextId}`;
}

export function ChatPanel() {
  const mcpClient = useMcpClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSend = useCallback(
    async (content: string) => {
      const userMsg: ChatMessage = {
        id: genId(),
        role: "user",
        content,
        timestamp: timestamp(),
      };

      const assistantId = genId();
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: timestamp(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsStreaming(true);

      let accumulated = "";

      for await (const chunk of mcpClient.sendMessage(content)) {
        if (chunk.type === "text") {
          accumulated += chunk.content;
          const snapshot = accumulated;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: snapshot } : m,
            ),
          );
        }
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, isStreaming: false } : m,
        ),
      );
      setIsStreaming(false);
    },
    [mcpClient],
  );

  return (
    <div className="flex flex-1 flex-col">
      <MessageList messages={messages} isStreaming={isStreaming} />
      <ChatInput onSend={handleSend} disabled={isStreaming} />
    </div>
  );
}
