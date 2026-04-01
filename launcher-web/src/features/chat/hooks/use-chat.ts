import { useState, useCallback, useEffect, useRef } from "react";
import { api, type Chat } from "@/core/api-client";
import type { ChatMessage } from "../components/message-list";

let _nextId = 0;
const uid = () => `msg-${Date.now()}-${++_nextId}`;

interface UseChatOptions {
  chatId: string | null;
  onChatCreated?: (id: string) => void;
}

export function useChat({ chatId, onChatCreated }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatMeta, setChatMeta] = useState<Chat | null>(null);
  const [scrollTrigger, setScrollTrigger] = useState(0);
  const [notFound, setNotFound] = useState(false);

  const chatIdRef = useRef(chatId);
  chatIdRef.current = chatId;

  const streamingRef = useRef(false);

  useEffect(() => {
    if (!chatId) { setChatMeta(null); setMessages([]); setNotFound(false); return; }
    if (streamingRef.current) return;

    setNotFound(false);
    api.getChat(chatId).then(setChatMeta).catch(() => setNotFound(true));
    api.listMessages(chatId).then((msgs) =>
      setMessages(msgs.map((m) => ({ id: m.id, role: m.role, content: m.content }))),
    ).catch(() => setNotFound(true));
  }, [chatId]);

  useEffect(() => {
    document.title = chatMeta?.title ?? "CubePath Assistant";
    return () => { document.title = "CubePath Assistant"; };
  }, [chatMeta?.title]);

  const handleSend = useCallback(
    async (content: string) => {
      let currentChatId = chatIdRef.current;

      if (!currentChatId) {
        const projects = await api.listProjects();
        if (projects.length === 0) return;
        const title = content.length > 50 ? content.slice(0, 47) + "..." : content;
        const chat = await api.createChat(projects[0].id, title);
        currentChatId = chat.id;
        chatIdRef.current = currentChatId;
        setChatMeta(chat);
        onChatCreated?.(currentChatId);
      }

      const userMsg: ChatMessage = { id: uid(), role: "user", content };
      const assistantId = uid();
      const assistantMsg: ChatMessage = { id: assistantId, role: "assistant", content: "", isStreaming: true };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsStreaming(true);
      setScrollTrigger((n) => n + 1);
      streamingRef.current = true;

      let accumulated = "";

      try {
        for await (const chunk of api.streamMessage(currentChatId, content)) {
          if (chunk.type === "text") {
            accumulated += chunk.content;
            const snapshot = accumulated;
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantId ? { ...m, content: snapshot } : m)),
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
        prev.map((m) => (m.id === assistantId ? { ...m, isStreaming: false } : m)),
      );
      setIsStreaming(false);
      streamingRef.current = false;
    },
    [onChatCreated],
  );

  return { messages, isStreaming, chatMeta, scrollTrigger, handleSend, notFound };
}
