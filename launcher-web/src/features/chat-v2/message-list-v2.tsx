import { useEffect, useLayoutEffect, useRef } from "react";
import { ChatBubble, CodeBlock, CubePathLogo } from "cubepath-ui";
import cubepathIcon from "../../assets/cubepath-icon.svg";
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
  if (msg.isStreaming && msg.content === "") return null;

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
  scrollTrigger?: number;
}

export function MessageListV2({ messages, isStreaming = false, scrollTrigger = 0 }: MessageListV2Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastUserRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll: pin user message to top of container on send
  useEffect(() => {
    if (scrollTrigger === 0) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const container = containerRef.current;
        const userEl = lastUserRef.current;
        if (!container || !userEl) return;

        const elRect = userEl.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const target = elRect.top - containerRect.top + container.scrollTop;
        const gap = parseInt(getComputedStyle(contentRef.current!).paddingTop) || 24;
        container.scrollTo({ top: target - gap, behavior: "smooth" });
      });
    });
  }, [scrollTrigger]);

  // Dynamic spacer: every render, measure content height vs last user msg position,
  // calculate remaining space to fill below content.
  // Uses offsetTop/offsetHeight (layout-relative, not scroll-relative) so scrolling
  // doesn't affect the calculation.
  useLayoutEffect(() => {
    const container = containerRef.current;
    const spacer = spacerRef.current;
    const userEl = lastUserRef.current;
    const content = contentRef.current;
    if (!container || !spacer || !content) return;

    // Measure content height WITHOUT collapsing spacer
    // contentH = total wrapper scrollHeight - current spacer height
    const currentSpacerH = spacer.offsetHeight;
    const realContentH = content.scrollHeight - currentSpacerH;
    const userOffset = userEl ? userEl.offsetTop - content.offsetTop : 0;
    const belowUserH = realContentH - userOffset;

    const viewportH = container.clientHeight;
    const needed = Math.max(0, viewportH - belowUserH);
    spacer.style.minHeight = `${needed}px`;
  });

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
    <div ref={containerRef} className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex-1" />
      <div ref={contentRef} className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-4 py-6 md:px-0">
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

        <div>
          <CubePathLogo
            src={cubepathIcon}
            size="sm"
            streaming={isStreaming}
            animations={["glow", "breathe", "rotate"]}
          />
        </div>

        {/* Dynamic spacer */}
        <div ref={spacerRef} />
      </div>
    </div>
  );
}
