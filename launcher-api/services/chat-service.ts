import type { Queries } from "../db/queries";
import type { AiProvider, ChatChunk } from "../types";
import { resolveGateway } from "./ai-gateway";
import { basePrompt } from "../prompts/base";
import { getTierPrompt } from "../prompts/tiers";

export function createChatService(queries: Queries) {
  return {
    async *sendMessage(
      chatId: string,
      content: string,
      userId: string,
      context?: Record<string, unknown>,
    ): AsyncIterable<ChatChunk> {
      // Save user message (clean, no context injected)
      const userMsgId = crypto.randomUUID();
      queries.createMessage(userMsgId, chatId, "user", content);

      // Load full conversation history
      const history = queries.listMessages(chatId);

      // Resolve AI provider
      const settings = queries.getSettings(userId);
      const provider = (settings.ai_provider || "mock") as AiProvider;
      const gateway = resolveGateway(provider, settings);

      // Compose system prompt from base + tier
      const tier = settings.permission_tier || "safe";
      const systemPrompt = `${basePrompt}\n\n${getTierPrompt(tier)}`;

      // Prepend system prompt to conversation
      const messagesWithSystem = [
        { id: "system", chat_id: chatId, role: "system" as const, content: systemPrompt, created_at: "" },
        ...history,
      ];

      // Inject client context as a system hint right before the AI responds
      if (context && Object.keys(context).length > 0) {
        messagesWithSystem.push({
          id: "context", chat_id: chatId, role: "system" as const,
          content: `The user interacted with the UI before sending this message. Context: ${JSON.stringify(context)}. Use this to inform your response but do not mention or repeat this context directly.`,
          created_at: "",
        });
      }

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
