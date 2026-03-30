import { ChatBubble, CodeBlock, CubePathLogo } from "cubepath-ui";
import cubepathIcon from "@/assets/cubepath-icon.svg";
import type { Components } from "react-markdown";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { highlight } from "sugar-high";
import "katex/dist/katex.min.css";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

const PROSE_CLASSES =
  "prose max-w-none break-words " +
  "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0 " +
  "prose-pre:bg-transparent prose-pre:m-0 " +
  "prose-code:bg-transparent prose-code:p-0 " +
  "prose-code:before:content-none prose-code:after:content-none";

const markdownComponents: Components = {
  code({ className, children }) {
    const match = /language-(\w+)/.exec(className || "");
    const code = String(children).replace(/\n$/, "");
    if (!match) {
      return <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{children}</code>;
    }
    return <CodeBlock code={code} language={match[1]} highlightedHtml={highlight(code)} />;
  },
  pre({ children }) {
    return <>{children}</>;
  },
};

function AssistantMessage({ msg }: { msg: ChatMessage }) {
  if (msg.isStreaming && msg.content === "") return null;

  return (
    <div className={PROSE_CLASSES}>
      <Markdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={markdownComponents}
      >
        {msg.content}
      </Markdown>
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
