import { useState, useEffect } from "react";
import { renderBlock, type ComponentData } from "../registry";
import { mapToolResult } from "../mappers";
import { GroupSkeleton } from "../primitives/skeleton";
import { FailedBlock } from "../primitives/error";
import { registerAdapter, type ComponentSegment } from "../port";
import { API_BASE_URL_V1 } from "@/core/api-client";

// --- Tool reference detection ---

interface ToolReference {
  tool: string;
  args?: Record<string, string>;
}

function isToolReference(data: unknown[]): data is ToolReference[] {
  return data.length > 0 && typeof data[0] === "object" && data[0] !== null && "tool" in data[0];
}

// --- Chat-specific layout ---

function ChatLayout({ blocks }: { blocks: ComponentData[] }) {
  if (blocks.length === 0) return null;

  if (blocks.length === 1) {
    return (
      <div className="flex justify-center">
        {renderBlock(blocks[0], 0)}
      </div>
    );
  }

  if (blocks.length <= 3) {
    const cols = blocks.length === 2
      ? "grid grid-cols-1 sm:grid-cols-2 gap-3"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3";

    return (
      <div className={cols}>
        {blocks.map((block, i) => renderBlock(block, i))}
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
        {blocks.map((block, i) => (
          <div key={i} className="snap-start shrink-0 w-[280px]">
            {renderBlock(block, i)}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Tool reference hydration ---

function ToolBlock({ component, reference }: { component: string; reference: ToolReference }) {
  const [blocks, setBlocks] = useState<ComponentData[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(reference.args ?? {});
    fetch(`${API_BASE_URL_V1}/api/tools/${reference.tool}?${params}`, {
      headers: { "X-User-Id": localStorage.getItem("cubepath_user_id") || "" },
    })
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
  return <ChatLayout blocks={blocks} />;
}

// --- Adapter entry point ---

function InlineChatBlock({ segment }: { segment: ComponentSegment }) {
  if (segment.failed) return <FailedBlock />;
  if (!segment.closed) return <GroupSkeleton count={segment.count} />;

  try {
    const parsed = JSON.parse(segment.jsonBuffer.trim()) as Array<Record<string, unknown>>;

    if (isToolReference(parsed)) {
      const refs = parsed as ToolReference[];
      return (
        <>
          {refs.map((ref, i) => (
            <ToolBlock key={i} component={segment.component} reference={ref} />
          ))}
        </>
      );
    }

    const items = mapToolResult(segment.component, parsed);
    const blocks = items.map((props) => ({ component: segment.component, props }));
    return <ChatLayout blocks={blocks} />;
  } catch {
    return <FailedBlock />;
  }
}

// --- Register this adapter ---
registerAdapter("inline-chat", InlineChatBlock);

export { InlineChatBlock };
