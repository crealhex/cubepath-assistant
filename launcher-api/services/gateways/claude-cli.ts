import type { AiGateway, ChatChunk, Message } from "../../types";

export function createClaudeCliGateway(binaryPath?: string): AiGateway {
  const bin = binaryPath || "claude";

  return {
    async *stream(messages: Message[]): AsyncIterable<ChatChunk> {
      const last = messages[messages.length - 1]?.content ?? "";

      const proc = Bun.spawn([bin, "-p", last, "--output-format", "stream-json"], {
        stdout: "pipe",
        stderr: "pipe",
      });

      const reader = proc.stdout.getReader();
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
          if (!trimmed) continue;

          try {
            const parsed = JSON.parse(trimmed);
            if (parsed.type === "content" && parsed.content) {
              yield { type: "text", content: parsed.content };
            }
          } catch {
            if (trimmed) {
              yield { type: "text", content: trimmed };
            }
          }
        }
      }

      yield { type: "done" };
    },
  };
}
