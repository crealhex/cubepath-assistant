import type { Queries } from "../db/queries";

export function chatRoutes(queries: Queries) {
  return {
    "GET /api/projects/:projectId/chats": (_req: Request, params: { projectId: string }) => {
      return Response.json(queries.listChats(params.projectId));
    },

    "POST /api/projects/:projectId/chats": async (req: Request, params: { projectId: string }) => {
      const body = (await req.json().catch(() => ({}))) as { title?: string };
      const chat = queries.createChat(crypto.randomUUID(), params.projectId, body.title);
      return Response.json(chat, { status: 201 });
    },

    "DELETE /api/chats/:id": (_req: Request, params: { id: string }) => {
      queries.deleteChat(params.id);
      return new Response(null, { status: 204 });
    },

    "GET /api/chats/:chatId/messages": (_req: Request, params: { chatId: string }) => {
      return Response.json(queries.listMessages(params.chatId));
    },
  };
}
