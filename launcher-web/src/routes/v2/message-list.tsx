import { ChatBubble, CodeBlock, CubePathLogo } from "cubepath-ui";
import cubepathIcon from "@/assets/cubepath-icon.svg";
import type { Components } from "react-markdown";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { highlight } from "sugar-high";
import { ComponentRenderer } from "./component-renderer";
import "katex/dist/katex.min.css";

export interface ComponentData {
  component: string;
  props: Record<string, unknown>;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  componentData?: Record<string, ComponentData>;
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

/**
 * Token protocol:
 *   {{begin:component-type}}   — opens a group
 *   {{component-type:index}}   — item within a group (or standalone if no begin/end)
 *   {{end:component-type}}     — closes the group, triggers render
 */
const TOKEN_REGEX = /(\{\{(?:begin|end):[\w-]+\}\}|\{\{[\w-]+:\d+\}\})/g;
const ITEM_PARSE = /^\{\{([\w-]+):(\d+)\}\}$/;
const BEGIN_PARSE = /^\{\{begin:([\w-]+)\}\}$/;
const END_PARSE = /^\{\{end:([\w-]+)\}\}$/;

type RenderSegment =
  | { type: "text"; content: string }
  | { type: "components"; blocks: ComponentData[]; complete: boolean };

function parseSegments(
  content: string,
  data: Record<string, ComponentData>,
  isStreaming: boolean,
): RenderSegment[] {
  const parts = content.split(TOKEN_REGEX);
  const result: RenderSegment[] = [];
  let activeGroup: RenderSegment | null = null;

  for (const part of parts) {
    if (BEGIN_PARSE.test(part)) {
      activeGroup = { type: "components", blocks: [], complete: false };
      result.push(activeGroup);
      continue;
    }

    if (END_PARSE.test(part)) {
      if (activeGroup) activeGroup.complete = true;
      activeGroup = null;
      continue;
    }

    const itemMatch = ITEM_PARSE.exec(part);
    if (itemMatch) {
      const tokenId = `${itemMatch[1]}:${itemMatch[2]}`;
      const block = data[tokenId];

      if (activeGroup) {
        if (block) activeGroup.blocks.push(block);
      } else {
        // Standalone — complete as soon as data arrives
        result.push({
          type: "components",
          blocks: block ? [block] : [],
          complete: !isStreaming || !!block,
        });
      }
      continue;
    }

    if (part.trim()) {
      result.push({ type: "text", content: part });
    }
  }

  if (!isStreaming) {
    for (const seg of result) {
      if (seg.type === "components") seg.complete = true;
    }
  }

  return result;
}

function GroupSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 px-4 py-4 animate-pulse">
      <div className="h-4 w-4 rounded-full bg-muted" />
      <div className="flex flex-col gap-1.5 flex-1">
        <div className="h-3 w-32 rounded bg-muted" />
        <div className="h-2.5 w-20 rounded bg-muted" />
      </div>
    </div>
  );
}

function AssistantMessage({ msg }: { msg: ChatMessage }) {
  if (msg.isStreaming && msg.content === "" && !msg.componentData) return null;

  const data = msg.componentData ?? {};
  const segments = parseSegments(msg.content, data, msg.isStreaming ?? false);

  return (
    <div className="flex flex-col gap-2">
      {segments.map((segment, i) => {
        if (segment.type === "components") {
          if (!segment.complete || segment.blocks.length === 0) {
            return <GroupSkeleton key={i} />;
          }
          return <ComponentRenderer key={i} blocks={segment.blocks} />;
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
