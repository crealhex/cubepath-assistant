import { useEffect, useRef } from "react";
import { ChatBubble, CubePathLogo } from "cubepath-ui";
import cubepathIcon from "@/assets/cubepath-icon.svg";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { PROSE_CLASSES, markdownComponents } from "./markdown";
import { parseSegments } from "@/features/rendering/parser";
import { dispatch } from "@/features/rendering/port";
import "@/features/rendering/adapters/inline-chat"; // register adapter
import { FailedBlock } from "@/features/rendering/primitives/error";
import { BlockErrorBoundary } from "@/features/rendering/primitives/error-boundary";
import type { Question } from "@/features/rendering/wizard/types";
import "katex/dist/katex.min.css";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

function AssistantMessage({ msg, onQuestionnaire }: { msg: ChatMessage; onQuestionnaire?: (q: Question[]) => void }) {
  const firedRef = useRef(false);

  const segments = (msg.isStreaming && msg.content === "")
    ? []
    : parseSegments(msg.content, msg.isStreaming ?? false);

  const questionnaireData = segments.find(
    (s) => s.type === "component-block" && s.component === "questionnaire" && s.closed
  );

  useEffect(() => {
    if (!questionnaireData || firedRef.current || !onQuestionnaire || !msg.isStreaming) return;
    if (questionnaireData.type !== "component-block") return;
    try {
      const parsed = JSON.parse(questionnaireData.jsonBuffer.trim()) as Array<{ questions: Question[] }>;
      if (parsed[0]?.questions) {
        firedRef.current = true;
        onQuestionnaire(parsed[0].questions);
      }
    } catch { /* ignore */ }
  }, [questionnaireData, onQuestionnaire]);

  if (segments.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 min-w-full">
      {segments.map((segment, i) => {
        if (segment.type === "component-block") {
          if (segment.component === "questionnaire") {
            return <p key={i} className="text-sm text-muted-foreground italic">Opening questionnaire...</p>;
          }

          return (
            <BlockErrorBoundary key={i} fallback={<FailedBlock />}>
              <div className="my-4">
                {dispatch(segment)}
              </div>
            </BlockErrorBoundary>
          );
        }

        return (
          <div key={i} className={PROSE_CLASSES}>
            <Markdown
              remarkPlugins={[remarkGfm, [remarkMath, { singleDollarTextMath: false }]]}
              rehypePlugins={[rehypeKatex]}
              components={markdownComponents}
            >
              {segment.content}
            </Markdown>
          </div>
        );
      })}
    </div>
  );
}

function UserMessage({ msg, innerRef }: { msg: ChatMessage; innerRef?: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={innerRef}>
      <ChatBubble variant="user">
        <span className="whitespace-pre-wrap">{msg.content}</span>
      </ChatBubble>
    </div>
  );
}

interface MessageListProps {
  messages: ChatMessage[];
  isStreaming?: boolean;
  lastUserRef?: React.RefObject<HTMLDivElement | null>;
  onQuestionnaire?: (questions: Question[]) => void;
}

export function MessageList({ messages, isStreaming = false, lastUserRef, onQuestionnaire }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <CubePathLogo src={cubepathIcon} size="lg" />
        <h2 className="text-lg font-semibold">CubePath Assistant</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Manage your cloud infrastructure through natural language. Deploy servers,
          check status, scale resources — just ask.
        </p>
      </div>
    );
  }

  const lastUserIdx = messages.findLastIndex((m) => m.role === "user");

  return (
    <>
      {messages.map((msg, i) =>
        msg.role === "user" ? (
          <UserMessage
            key={msg.id}
            msg={msg}
            innerRef={i === lastUserIdx ? lastUserRef : undefined}
          />
        ) : (
          <AssistantMessage key={msg.id} msg={msg} onQuestionnaire={onQuestionnaire} />
        ),
      )}

      <CubePathLogo
        src={cubepathIcon}
        size="sm"
        streaming={isStreaming}
        animations={["glow", "breathe", "rotate"]}
      />
    </>
  );
}
