import type { ChatService } from "../services/chat-service";

export function aiRoutes(chatService: ChatService) {
  return {
    "POST /api/chats/:chatId/stream": async (_req: Request, params: { chatId: string; _userId: string }) => {
      const body = (await _req.json()) as { content: string };
      if (!body.content) return new Response("content required", { status: 400 });

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of chatService.sendMessage(params.chatId, body.content, params._userId)) {
              const data = `data: ${JSON.stringify(chunk)}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          } catch (err) {
            const errMsg = err instanceof Error ? err.message : "Unknown error";
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text", content: `\n\nError: ${errMsg}` })}\n\n`));
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    },
  };
}
