import { useState, useEffect } from "react";
import { InlineError } from "cubepath-ui";
import { ComponentRenderer } from "./component-renderer";
import { mapToolResult } from "./tool-mappers";
import type { RenderSegment } from "./block-parser";

import { API_BASE_URL_V1 } from "@/services/api-client";

interface ToolReference {
  tool: string;
  args?: Record<string, string>;
}

function isToolReference(data: unknown[]): data is ToolReference[] {
  return data.length > 0 && typeof data[0] === "object" && data[0] !== null && "tool" in data[0];
}

export function GroupSkeleton({ count }: { count: number }) {
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

export function FailedBlock() {
  return <InlineError />;
}

function ToolBlock({ component, reference }: { component: string; reference: ToolReference }) {
  const [blocks, setBlocks] = useState<Array<{ component: string; props: Record<string, unknown> }> | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(reference.args ?? {});
    fetch(`${API_BASE_URL_V1}/api/tools/${reference.tool}?${params}`)
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

export function BlockRenderer({ segment }: { segment: RenderSegment & { type: "component-block" } }) {
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

    const blocks = parsed.map((props) => ({ component: segment.component, props }));
    return <ComponentRenderer blocks={blocks} />;
  } catch {
    return <FailedBlock />;
  }
}
