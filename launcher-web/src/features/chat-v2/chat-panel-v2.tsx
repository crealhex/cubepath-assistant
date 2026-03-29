import { useState, useCallback, useEffect, useRef } from "react";
import { ChatInputV2 } from "./chat-input-v2";
import { MessageListV2, type ChatMessage } from "./message-list-v2";
import { api } from "../../services/api-client";

let _id = 0;
const uid = () => `msg-${Date.now()}-${++_id}`;

interface ChatPanelV2Props {
  chatId: string | null;
  onChatCreated?: (chatId: string) => void;
}

export function ChatPanelV2({ chatId, onChatCreated }: ChatPanelV2Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const chatIdRef = useRef(chatId);
  const streamingRef = useRef(false);

  chatIdRef.current = chatId;

  // Load messages when switching to an existing chat (not during streaming)
  useEffect(() => {
    if (!chatId || streamingRef.current) return;
    api.listMessages(chatId).then((msgs) =>
      setMessages(msgs.map((m) => ({ id: m.id, role: m.role, content: m.content }))),
    );
  }, [chatId]);

  const handleSend = useCallback(
    async (content: string) => {
      let currentChatId = chatIdRef.current;

      // Lazy chat creation
      if (!currentChatId) {
        const projects = await api.listProjects();
        if (projects.length === 0) return;
        const chat = await api.createChat(projects[0].id);
        currentChatId = chat.id;
        chatIdRef.current = currentChatId;
        onChatCreated?.(currentChatId);
      }

      const userMsg: ChatMessage = {
        id: uid(),
        role: "user",
        content,
      };

      const assistantId = uid();
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsStreaming(true);
      streamingRef.current = true;

      let accumulated = "";

      try {
        for await (const chunk of api.streamMessage(currentChatId, content)) {
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
      } catch (err) {
        console.error("Stream error:", err);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: accumulated + "\n\n*Error: stream failed*" }
              : m,
          ),
        );
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, isStreaming: false } : m,
        ),
      );
      setIsStreaming(false);
      streamingRef.current = false;
    },
    [onChatCreated],
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <MessageListV2 messages={messages} isStreaming={isStreaming} />
      <ChatInputV2 onSend={handleSend} disabled={isStreaming} />
    </div>
  );
}
