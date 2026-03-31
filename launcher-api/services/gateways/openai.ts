import type { AiGateway, ChatChunk, Message } from "../../types";

export function createOpenAiGateway(apiKey: string, model: string, baseUrl?: string): AiGateway {
  const url = `${baseUrl || "https://api.openai.com/v1"}/chat/completions`;

  return {
    async *stream(messages: Message[], tools?: unknown[]): AsyncIterable<ChatChunk> {
      const body: Record<string, unknown> = {
        model,
        stream: true,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      };
      if (tools && tools.length > 0) {
        body.tools = tools;
      }

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.text();
        yield { type: "text", content: `Error from AI provider: ${res.status} ${err}` };
        yield { type: "done" };
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        yield { type: "done" };
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          const data = trimmed.slice(6);
          if (data === "[DONE]") {
            yield { type: "done" };
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              yield { type: "text", content: delta };
            }
          } catch {
            // skip malformed chunks
          }
        }
      }

      yield { type: "done" };
    },
  };
}
