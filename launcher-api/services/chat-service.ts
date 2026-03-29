import type { Queries } from "../db/queries";
import type { AiProvider, ChatChunk } from "../types";
import { resolveGateway } from "./ai-gateway";

export function createChatService(queries: Queries) {
  return {
    async *sendMessage(
      chatId: string,
      content: string,
    ): AsyncIterable<ChatChunk> {
      // Save user message
      const userMsgId = crypto.randomUUID();
      queries.createMessage(userMsgId, chatId, "user", content);

      // Load full conversation history
      const history = queries.listMessages(chatId);

      // Resolve AI provider
      const settings = queries.getSettings();
      const provider = (settings.ai_provider || "mock") as AiProvider;
      const gateway = resolveGateway(provider, settings);

      // Stream AI response
      let accumulated = "";

      for await (const chunk of gateway.stream(history)) {
        if (chunk.type === "text") {
          accumulated += chunk.content;
        }
        yield chunk;
      }

      // Save assistant message
      if (accumulated) {
        const assistantMsgId = crypto.randomUUID();
        queries.createMessage(assistantMsgId, chatId, "assistant", accumulated);
      }

      // Auto-title the chat if it's the first message
      if (history.length <= 1 && content.length > 0) {
        const title = content.length > 50 ? content.slice(0, 47) + "..." : content;
        queries.updateChatTitle(chatId, title);
      }
    },
  };
}

export type ChatService = ReturnType<typeof createChatService>;
