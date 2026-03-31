import createDebug from "debug";
import type { AiGateway, ChatChunk, Message } from "../../../types";
import { getDefinitions, execute } from "../../tools";
import { parseOpenAiStream, type ToolCallChunk } from "./stream";

const debug = createDebug("launcher:openai");
const MAX_TOOL_ROUNDS = 5;
const DISPLAY_TOOL = "display";

function buildRequest(url: string, apiKey: string, model: string, tools: unknown[], messages: Array<Record<string, unknown>>) {
  const body: Record<string, unknown> = { model, stream: true, messages };
  if (tools.length > 0) body.tools = tools;

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
}

function appendToolCalls(conversation: Array<Record<string, unknown>>, calls: ToolCallChunk[]) {
  conversation.push({
    role: "assistant",
    content: null,
    tool_calls: calls.map((tc) => ({
      id: tc.id,
      type: "function",
      function: { name: tc.name, arguments: tc.arguments },
    })),
  });
}

function parseToolArgs(tc: ToolCallChunk): Record<string, unknown> {
  try { return JSON.parse(tc.arguments); } catch { return {}; }
}

/** Split tool calls into display calls (→ component chunks) and regular calls (→ execute + feed back) */
function splitToolCalls(calls: ToolCallChunk[]): { displayCalls: ToolCallChunk[]; regularCalls: ToolCallChunk[] } {
  const displayCalls: ToolCallChunk[] = [];
  const regularCalls: ToolCallChunk[] = [];
  for (const tc of calls) {
    (tc.name === DISPLAY_TOOL ? displayCalls : regularCalls).push(tc);
  }
  return { displayCalls, regularCalls };
}

async function executeRegularCalls(conversation: Array<Record<string, unknown>>, calls: ToolCallChunk[]) {
  for (const tc of calls) {
    const args = parseToolArgs(tc);
    const result = await execute(tc.name, args);
    debug("tool result: %s", result);
    conversation.push({ role: "tool", tool_call_id: tc.id, content: result });
  }
}

function emitDisplayCalls(conversation: Array<Record<string, unknown>>, calls: ToolCallChunk[]): ChatChunk[] {
  const chunks: ChatChunk[] = [];
  for (const tc of calls) {
    const args = parseToolArgs(tc);
    const id = args.id as string;
    const component = args.component as string;
    const props = (args.props ?? {}) as Record<string, unknown>;

    debug("display: %s → %s", id, component);
    chunks.push({ type: "component", block: { id, component, props } });

    // Feed back a simple acknowledgment so the API doesn't complain about missing tool results
    conversation.push({ role: "tool", tool_call_id: tc.id, content: "displayed" });
  }
  return chunks;
}

async function* streamRound(
  url: string,
  apiKey: string,
  model: string,
  tools: unknown[],
  conversation: Array<Record<string, unknown>>,
): AsyncIterable<ChatChunk> {
  const res = await buildRequest(url, apiKey, model, tools, conversation);

  if (!res.ok) {
    const err = await res.text();
    debug("error: %d %s", res.status, err);
    yield { type: "text", content: `Error from AI provider: ${res.status} ${err}` };
    yield { type: "done" };
    return;
  }

  const reader = res.body?.getReader();
  if (!reader) { yield { type: "done" }; return; }

  let roundText = "";
  for await (const event of parseOpenAiStream(reader)) {
    if (event.type === "text") {
      roundText += event.content;
      yield event;
      continue;
    }

    if (event.type === "tool_calls") {
      debug("tool calls: %o", event.calls.map((c) => `${c.name}(${c.arguments})`));
      appendToolCalls(conversation, event.calls);

      const { displayCalls, regularCalls } = splitToolCalls(event.calls);

      // Emit component chunks for display calls
      for (const chunk of emitDisplayCalls(conversation, displayCalls)) {
        yield chunk;
      }

      // Execute regular tool calls
      await executeRegularCalls(conversation, regularCalls);
      continue;
    }

    if (event.type === "done") {
      debug("text output: %s", roundText);
      return;
    }
  }
}

export function createOpenAiGateway(apiKey: string, model: string, baseUrl?: string): AiGateway {
  const url = `${baseUrl || "https://api.openai.com/v1"}/chat/completions`;
  const tools = getDefinitions();

  return {
    async *stream(messages: Message[]): AsyncIterable<ChatChunk> {
      const conversation: Array<Record<string, unknown>> =
        messages.map((m) => ({ role: m.role, content: m.content }));

      for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
        debug("round %d, messages: %d", round, conversation.length);
        const prevLength = conversation.length;

        for await (const chunk of streamRound(url, apiKey, model, tools, conversation)) {
          yield chunk;
          if (chunk.type === "done") return;
        }

        if (conversation.length === prevLength) {
          debug("done, no tool calls");
          yield { type: "done" };
          return;
        }

        debug("tool round complete, continuing");
      }

      yield { type: "done" };
    },
  };
}
