import { ChatBubble, CubePathLogo } from "cubepath-ui";
import cubepathIcon from "@/assets/cubepath-icon.svg";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { PROSE_CLASSES, markdownComponents } from "./markdown";
import { parseSegments } from "./block-parser";
import { BlockRenderer } from "./block-renderer";
import "katex/dist/katex.min.css";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

function AssistantMessage({ msg }: { msg: ChatMessage }) {
  if (msg.isStreaming && msg.content === "") return null;

  const segments = parseSegments(msg.content, msg.isStreaming ?? false);

  return (
    <div className="flex flex-col gap-2">
      {segments.map((segment, i) => {
        if (segment.type === "component-block") {
          return <div key={i}><BlockRenderer segment={segment} /></div>;
        }

        return (
          <div key={i} className={PROSE_CLASSES}>
            <Markdown
              remarkPlugins={[remarkGfm, remarkMath]}
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
        {msg.content}
      </ChatBubble>
    </div>
  );
}

interface MessageListV2Props {
  messages: ChatMessage[];
  isStreaming?: boolean;
  lastUserRef?: React.RefObject<HTMLDivElement | null>;
}

export function MessageListV2({ messages, isStreaming = false, lastUserRef }: MessageListV2Props) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <CubePathLogo src={cubepathIcon} size="lg" />
        <h2 className="text-lg font-semibold">Welcome to CubePath</h2>
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
          <AssistantMessage key={msg.id} msg={msg} />
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
