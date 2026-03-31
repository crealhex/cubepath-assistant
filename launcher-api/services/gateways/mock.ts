import type { AiGateway, ChatChunk, Message } from "../../types";
import { matchResponse } from "./mock-responses";

async function* streamWords(text: string): AsyncIterable<ChatChunk> {
  const words = text.split(/(\s+)/);
  for (const word of words) {
    yield { type: "text", content: word };
    await Bun.sleep(18 + Math.random() * 25);
  }
}

export function createMockGateway(): AiGateway {
  return {
    async *stream(messages: Message[]): AsyncIterable<ChatChunk> {
      const last = messages[messages.length - 1]?.content ?? "";
      const { text, componentData } = matchResponse(last);

      const parts = text.split(/(\{\{(?:begin|end):[\w-]+\}\}|\{\{[\w-]+:\d+\}\})/);
      await Bun.sleep(300);

      for (const part of parts) {
        const tokenMatch = /^\{\{([\w-]+:\d+)\}\}$/.exec(part);
        if (tokenMatch && componentData?.[tokenMatch[1]]) {
          yield { type: "text", content: part };
          await Bun.sleep(300);
          const id = tokenMatch[1];
          const { component, props } = componentData[id];
          yield { type: "component", block: { id, component, props } };
          await Bun.sleep(100);
        } else if (part) {
          yield* streamWords(part);
        }
      }

      yield { type: "done" };
    },
  };
}
