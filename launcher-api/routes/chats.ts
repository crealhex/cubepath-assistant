import type { Queries } from "../db/queries";

export function chatRoutes(queries: Queries) {
  return {
    "GET /api/projects/:projectId/chats": (_req: Request, params: { projectId: string; _userId: string }) => {
      return Response.json(queries.listChats(params.projectId, params._userId));
    },

    "POST /api/projects/:projectId/chats": async (req: Request, params: { projectId: string; _userId: string }) => {
      const body = (await req.json().catch(() => ({}))) as { title?: string };
      const chat = queries.createChat(crypto.randomUUID(), params._userId, params.projectId, body.title);
      return Response.json(chat, { status: 201 });
    },

    "GET /api/chats/:id": (_req: Request, params: { id: string }) => {
      const chat = queries.getChat(params.id);
      if (!chat) return new Response("Not Found", { status: 404 });
      return Response.json(chat);
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
