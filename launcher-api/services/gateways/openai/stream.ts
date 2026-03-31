import { parseSSE } from "../sse-parser";

export interface ToolCallChunk {
  id: string;
  name: string;
  arguments: string;
}

export type OpenAiEvent =
  | { type: "text"; content: string }
  | { type: "tool_calls"; calls: ToolCallChunk[] }
  | { type: "done" };

/** Interprets OpenAI streamed deltas into text and tool call events */
export async function* parseOpenAiStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
): AsyncIterable<OpenAiEvent> {
  const toolCalls = new Map<number, ToolCallChunk>();

  for await (const data of parseSSE(reader)) {
    try {
      const parsed = JSON.parse(data);
      const delta = parsed.choices?.[0]?.delta;
      if (!delta) continue;

      if (delta.content) {
        yield { type: "text", content: delta.content };
      }

      if (delta.tool_calls) {
        for (const tc of delta.tool_calls) {
          const idx = tc.index ?? 0;
          if (!toolCalls.has(idx)) {
            toolCalls.set(idx, { id: tc.id ?? "", name: tc.function?.name ?? "", arguments: "" });
          }
          const acc = toolCalls.get(idx)!;
          if (tc.id) acc.id = tc.id;
          if (tc.function?.name) acc.name = tc.function.name;
          if (tc.function?.arguments) acc.arguments += tc.function.arguments;
        }
      }

      const finishReason = parsed.choices?.[0]?.finish_reason;
      if (finishReason === "tool_calls" && toolCalls.size > 0) {
        yield { type: "tool_calls", calls: [...toolCalls.values()] };
        toolCalls.clear();
      }
    } catch {
      // skip malformed chunks
    }
  }

  // Flush any remaining tool calls
  if (toolCalls.size > 0) {
    yield { type: "tool_calls", calls: [...toolCalls.values()] };
  }
  yield { type: "done" };
}
