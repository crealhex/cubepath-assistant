/**
 * Inline JSON component protocol:
 *   {{component-name:count}} — opens a block, count = number of items (for skeleton layout)
 *   [... JSON array ...]     — props for each component item
 *   {{/component-name}}      — closes the block, triggers parse + render
 */
const BLOCK_REGEX = /(\{\{[\w-]+:\d+\}\}|\{\{\/[\w-]+\}\})/g;
const OPEN_PARSE = /^\{\{([\w-]+):(\d+)\}\}$/;
const CLOSE_PARSE = /^\{\{\/([\w-]+)\}\}$/;

export type RenderSegment =
  | { type: "text"; content: string }
  | { type: "component-block"; component: string; count: number; jsonBuffer: string; closed: boolean; failed: boolean };

export function parseSegments(content: string, isStreaming: boolean): RenderSegment[] {
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

  if (!isStreaming) {
    for (const seg of result) {
      if (seg.type === "component-block" && !seg.closed) {
        seg.failed = true;
      }
    }
  }

  return result;
}
