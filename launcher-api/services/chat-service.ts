import type { Queries } from "../db/queries";
import type { AiProvider, ChatChunk } from "../types";
import { resolveGateway } from "./ai-gateway";

const systemPrompt = await Bun.file(
  new URL("../prompts/system.md", import.meta.url).pathname,
).text();

export function createChatService(queries: Queries) {
  return {
    async *sendMessage(
      chatId: string,
      content: string,
      userId: string,
    ): AsyncIterable<ChatChunk> {
      // Save user message
      const userMsgId = crypto.randomUUID();
      queries.createMessage(userMsgId, chatId, "user", content);

      // Load full conversation history
      const history = queries.listMessages(chatId);

      // Resolve AI provider
      const settings = queries.getSettings(userId);
      const provider = (settings.ai_provider || "mock") as AiProvider;
      const gateway = resolveGateway(provider, settings);

      // Prepend system prompt to conversation
      const messagesWithSystem = [
        { id: "system", chat_id: chatId, role: "system" as const, content: systemPrompt, created_at: "" },
        ...history,
      ];

      // Stream AI response — accumulate text + component data for persistence
      let accumulatedText = "";
      const componentData: Record<string, { component: string; props: Record<string, unknown> }> = {};

      for await (const chunk of gateway.stream(messagesWithSystem)) {
        if (chunk.type === "text") {
          accumulatedText += chunk.content;
        } else if (chunk.type === "component") {
          const { id, component, props } = chunk.block;
          componentData[id] = { component, props };
        }
        yield chunk;
      }

      // Save assistant message — JSON format if components present
      if (accumulatedText || Object.keys(componentData).length > 0) {
        const assistantMsgId = crypto.randomUUID();
        const savedContent = Object.keys(componentData).length > 0
          ? JSON.stringify({ text: accumulatedText, componentData })
          : accumulatedText;
        queries.createMessage(assistantMsgId, chatId, "assistant", savedContent);
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
