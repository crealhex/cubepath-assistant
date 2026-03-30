import { ChatBubble, CodeBlock, CubePathLogo } from "cubepath-ui";
import cubepathIcon from "@/assets/cubepath-icon.svg";
import type { Components } from "react-markdown";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

const markdownComponents: Components = {
  code({ className, children }) {
    const match = /language-(\w+)/.exec(className || "");
    const code = String(children).replace(/\n$/, "");

    if (!match) {
      return <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{children}</code>;
    }

    return <CodeBlock code={code} language={match[1]} />;
  },
  pre({ children }) {
    return <>{children}</>;
  },
};

function AssistantMessage({ msg }: { msg: ChatMessage }) {
  if (msg.isStreaming && msg.content === "") {
    return null;
  }

  return (
    <div className="prose max-w-none break-words [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 prose-pre:bg-transparent prose-pre:m-0 prose-code:bg-transparent prose-code:p-0 prose-code:before:content-none prose-code:after:content-none">
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

function UserMessage({ msg }: { msg: ChatMessage }) {
  return (
    <ChatBubble variant="user" timestamp={msg.timestamp}>
      {msg.content}
    </ChatBubble>
  );
}

interface MessageListProps {
  messages: ChatMessage[];
  isStreaming?: boolean;
}

export function MessageList({ messages, isStreaming = false }: MessageListProps) {

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <CubePathLogo src={cubepathIcon} size="lg" />
        <h2 className="text-lg font-semibold">Welcome to CubePath</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Manage your cloud infrastructure through natural language. Deploy servers,
          check status, scale resources — just ask.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {/* Spring — pushes content to bottom when short */}
      <div className="flex-1" />

      <div className="flex flex-col gap-6 p-6">
        {messages.map((msg) =>
          msg.role === "user" ? (
            <UserMessage key={msg.id} msg={msg} />
          ) : (
            <AssistantMessage key={msg.id} msg={msg} />
          ),
        )}

        {/* Logo — animates while streaming */}
        <CubePathLogo
          src={cubepathIcon}
          size="sm"
          streaming={isStreaming}
          animations={["glow", "breathe", "rotate"]}
        />
      </div>
    </div>
  );
}
