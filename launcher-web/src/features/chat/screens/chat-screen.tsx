import { useState, useRef, useEffect, useCallback } from "react";
import { useOutletContext, useNavigate } from "react-router";
import { Button } from "cubepath-ui";
import { ArrowDown } from "lucide-react";
import { ChatInput } from "../components/chat-input";
import { MessageList } from "../components/message-list";
import { ScrollContainer } from "../components/scroll-container";
import { useChat } from "../hooks/use-chat";
import { Questionnaire } from "@/features/rendering/wizard/questionnaire";
import type { Question } from "@/features/rendering/wizard/types";
import type { AppContext } from "@/core/layout/app-layout";

export default function ChatScreen() {
  const { activeChatId: chatId, setActiveChatId: onChatCreated } = useOutletContext<AppContext>();
  const navigate = useNavigate();
  const { messages, isStreaming, chatMeta, scrollTrigger, handleSend, notFound, addContext } = useChat({ chatId, onChatCreated });

  useEffect(() => {
    if (notFound) navigate("/", { replace: true });
  }, [notFound, navigate]);

  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [questionnaire, setQuestionnaire] = useState<Question[] | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastUserRef = useRef<HTMLDivElement>(null);

  function handleJumpToBottom() {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }

  const handleQuestionnaire = useCallback((questions: Question[]) => {
    setQuestionnaire(questions);
  }, []);

  function handleQuestionnaireComplete(answers: Record<string, string>) {
    addContext("questionnaire", answers);
    const formatted = Object.entries(answers)
      .map(([q, a]) => `Q: ${q}\nA: ${a}`)
      .join("\n\n");
    handleSend(formatted);
    setQuestionnaire(null);
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {chatMeta && (
        <header className="flex h-12 shrink-0 items-center border-b border-border px-4">
          <h1 className="text-base font-medium truncate">
            {chatMeta.title}
          </h1>
        </header>
      )}

      {messages.length === 0 ? (
        <MessageList messages={[]} onQuestionnaire={handleQuestionnaire} />
      ) : (
        <ScrollContainer
          scrollTrigger={scrollTrigger}
          pinRef={lastUserRef}
          isStreaming={isStreaming}
          onCanScrollDown={setShowScrollBtn}
          containerRef={scrollContainerRef}
        >
          <MessageList
            messages={messages}
            isStreaming={isStreaming}
            lastUserRef={lastUserRef}
            onQuestionnaire={handleQuestionnaire}
          />
        </ScrollContainer>
      )}

      {showScrollBtn && (
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-35 left-1/2 -translate-x-1/2 rounded-full bg-background shadow-md z-10"
          onClick={handleJumpToBottom}
        >
          <ArrowDown className="size-4" />
        </Button>
      )}

      <ChatInput onSend={handleSend} disabled={isStreaming}>
        {questionnaire && (
          <Questionnaire
            questions={questionnaire}
            onComplete={handleQuestionnaireComplete}
            onDismiss={() => setQuestionnaire(null)}
          />
        )}
      </ChatInput>
    </div>
  );
}
