import type { Queries } from "../db/queries";
import type { AiProvider, ChatChunk, Message } from "../types";
import { resolveGateway } from "./ai-gateway";
import { basePrompt } from "../prompts/base";
import { getTierPrompt } from "../prompts/tiers";

function composeSystemPrompt(tier: string) {
  return `${basePrompt}\n\n${getTierPrompt(tier)}`;
}

function buildConversation(systemPrompt: string, chatId: string, history: Message[]) {
  return [
    { id: "system", chat_id: chatId, role: "system" as const, content: systemPrompt, created_at: "" },
    ...history,
  ];
}

function injectContext(messages: Message[], chatId: string, context?: Record<string, unknown>) {
  if (!context || Object.keys(context).length === 0) return;
  messages.push({
    id: "context", chat_id: chatId, role: "system" as const,
    content: [
      "The user interacted with the UI before sending this message.",
      `Context: ${JSON.stringify(context)}.`,
      "Use this to inform your response but do not mention or repeat this context directly.",
    ].join(" "),
    created_at: "",
  });
}

function saveAssistantMessage(queries: Queries, chatId: string, text: string, componentData: Record<string, unknown>) {
  if (!text && Object.keys(componentData).length === 0) return;
  const content = Object.keys(componentData).length > 0
    ? JSON.stringify({ text, componentData })
    : text;
  queries.createMessage(crypto.randomUUID(), chatId, "assistant", content);
}

function autoTitleChat(queries: Queries, chatId: string, content: string, historyLength: number) {
  if (historyLength > 1 || content.length === 0) return;
  const title = content.length > 50 ? content.slice(0, 47) + "..." : content;
  queries.updateChatTitle(chatId, title);
}

export function createChatService(queries: Queries) {
  return {
    async *sendMessage(
      chatId: string,
      content: string,
      userId: string,
      context?: Record<string, unknown>,
    ): AsyncIterable<ChatChunk> {
      queries.createMessage(crypto.randomUUID(), chatId, "user", content);

      const history = queries.listMessages(chatId);
      const settings = queries.getSettings(userId);
      const gateway = resolveGateway((settings.ai_provider || "mock") as AiProvider, settings);

      const systemPrompt = composeSystemPrompt(settings.permission_tier || "safe");
      const conversation = buildConversation(systemPrompt, chatId, history);
      injectContext(conversation, chatId, context);

      let accumulatedText = "";
      const componentData: Record<string, { component: string; props: Record<string, unknown> }> = {};

      for await (const chunk of gateway.stream(conversation)) {
        if (chunk.type === "text") {
          accumulatedText += chunk.content;
        } else if (chunk.type === "component") {
          const { id, component, props } = chunk.block;
          componentData[id] = { component, props };
        }
        yield chunk;
      }

      saveAssistantMessage(queries, chatId, accumulatedText, componentData);
      autoTitleChat(queries, chatId, content, history.length);
    },
  };
}

export type ChatService = ReturnType<typeof createChatService>;
