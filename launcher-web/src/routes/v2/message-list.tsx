import { useState, useEffect } from "react";
import { ChatBubble, CodeBlock, CubePathLogo } from "cubepath-ui";
import cubepathIcon from "@/assets/cubepath-icon.svg";
import type { Components } from "react-markdown";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { highlight } from "sugar-high";
import { ComponentRenderer } from "./component-renderer";
import { mapToolResult } from "./tool-mappers";
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

/**
 * Inline JSON component protocol:
 *   {{component-name:count}} — opens a block, count = number of items (for skeleton layout)
 *   [... JSON array ...]     — props for each component item
 *   {{/component-name}}      — closes the block, triggers parse + render
 */
const BLOCK_REGEX = /(\{\{[\w-]+:\d+\}\}|\{\{\/[\w-]+\}\})/g;
const OPEN_PARSE = /^\{\{([\w-]+):(\d+)\}\}$/;
const CLOSE_PARSE = /^\{\{\/([\w-]+)\}\}$/;

type RenderSegment =
  | { type: "text"; content: string }
  | { type: "component-block"; component: string; count: number; jsonBuffer: string; closed: boolean; failed: boolean };

function parseSegments(content: string, isStreaming: boolean): RenderSegment[] {
  const parts = content.split(BLOCK_REGEX);
  const result: RenderSegment[] = [];
  let active: RenderSegment | null = null;

  for (const part of parts) {
    const openMatch = OPEN_PARSE.exec(part);
    if (openMatch) {
      active = {
        type: "component-block",
        component: openMatch[1],
        count: Number(openMatch[2]),
        jsonBuffer: "",
        closed: false,
        failed: false,
      };
      result.push(active);
      continue;
    }

    const closeMatch = CLOSE_PARSE.exec(part);
    if (closeMatch && active?.type === "component-block" && active.component === closeMatch[1]) {
      active.closed = true;
      active = null;
      continue;
    }

    if (active?.type === "component-block") {
      active.jsonBuffer += part;
      continue;
    }

    if (part.trim()) {
      result.push({ type: "text", content: part });
    }
  }

  // If stream ended with unclosed block, mark as failed
  if (!isStreaming) {
    for (const seg of result) {
      if (seg.type === "component-block" && !seg.closed) {
        seg.failed = true;
      }
    }
  }

  return result;
}

function GroupSkeleton({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: Math.max(1, count) }, (_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border border-border/60 px-4 py-4 animate-pulse">
          <div className="h-4 w-4 rounded-full bg-muted" />
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="h-3 w-32 rounded bg-muted" />
            <div className="h-2.5 w-20 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

function FailedBlock() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-status-outage/30 px-4 py-3 text-xs text-muted-foreground">
      <span className="text-status-outage font-bold">!</span>
      Failed to load component
    </div>
  );
}

const API_BASE = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:3001`;

interface ToolReference {
  tool: string;
  args?: Record<string, string>;
}

function isToolReference(data: unknown[]): data is ToolReference[] {
  return data.length > 0 && typeof data[0] === "object" && data[0] !== null && "tool" in data[0];
}

function ToolBlock({ component, reference }: { component: string; reference: ToolReference }) {
  const [blocks, setBlocks] = useState<Array<{ component: string; props: Record<string, unknown> }> | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(reference.args ?? {});
    fetch(`${API_BASE}/api/tools/${reference.tool}?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json();
      })
      .then((result) => {
        const items = mapToolResult(component, result);
        setBlocks(items.map((props) => ({ component, props })));
      })
      .catch(() => setError(true));
  }, [component, reference.tool, JSON.stringify(reference.args)]);

  if (error) return <FailedBlock />;
  if (!blocks) return <GroupSkeleton count={1} />;
  return <ComponentRenderer blocks={blocks} />;
}

function parseAndRenderBlock(segment: RenderSegment & { type: "component-block" }) {
  if (segment.failed) return <FailedBlock />;
  if (!segment.closed) return <GroupSkeleton count={segment.count} />;

  try {
    const parsed = JSON.parse(segment.jsonBuffer.trim()) as Array<Record<string, unknown>>;

    if (isToolReference(parsed)) {
      return (
        <>
          {parsed.map((ref, i) => (
            <ToolBlock key={i} component={segment.component} reference={ref} />
          ))}
        </>
      );
    }

    const blocks = parsed.map((props) => ({ component: segment.component, props }));
    return <ComponentRenderer blocks={blocks} />;
  } catch {
    return <FailedBlock />;
  }
}

function AssistantMessage({ msg }: { msg: ChatMessage }) {
  if (msg.isStreaming && msg.content === "") return null;

  const segments = parseSegments(msg.content, msg.isStreaming ?? false);

  return (
    <div className="flex flex-col gap-2">
      {segments.map((segment, i) => {
        if (segment.type === "component-block") {
          return <div key={i}>{parseAndRenderBlock(segment)}</div>;
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
