import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "cubepath-ui";
import { ArrowDown } from "lucide-react";
import { ChatInputV2 } from "./chat-input-v2";
import { MessageListV2, type ChatMessage } from "./message-list-v2";
import { api, type Chat } from "../../services/api-client";

let _nextId = 0;
const uid = () => `msg-${Date.now()}-${++_nextId}`;

interface ChatPanelV2Props {
  chatId: string | null;
  onChatCreated?: (chatId: string) => void;
}

export function ChatPanelV2({ chatId, onChatCreated }: ChatPanelV2Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatMeta, setChatMeta] = useState<Chat | null>(null);
  const [scrollTrigger, setScrollTrigger] = useState(0);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync prop to ref so handleSend always reads the current chatId
  // without needing it as a useCallback dependency (avoids stale closures).
  const chatIdRef = useRef(chatId);
  chatIdRef.current = chatId;

  const streamingRef = useRef(false);

  function loadChatOnSwitch() {
    if (!chatId) { setChatMeta(null); setMessages([]); return; }
    if (streamingRef.current) return;

    api.getChat(chatId).then(setChatMeta).catch(() => setChatMeta(null));
    api.listMessages(chatId).then((msgs) =>
      setMessages(msgs.map((m) => ({ id: m.id, role: m.role, content: m.content }))),
    );
  }

  useEffect(loadChatOnSwitch, [chatId]);

  const handleSend = useCallback(
    async (content: string) => {
      let currentChatId = chatIdRef.current;

      // Lazy chat creation — DB entry only when user actually sends
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

  function handleJumpToBottom() {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {chatMeta && (
        <header className="flex h-12 shrink-0 items-center border-b border-border px-4">
          <h1 className="mx-auto max-w-[720px] w-full text-sm font-medium truncate">
            {chatMeta.title}
          </h1>
        </header>
      )}
      <MessageListV2
        messages={messages}
        isStreaming={isStreaming}
        scrollTrigger={scrollTrigger}
        onScrollChange={setShowScrollBtn}
        containerRef={scrollContainerRef}
      />

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
