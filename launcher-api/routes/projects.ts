import type { Queries } from "../db/queries";

export function projectRoutes(queries: Queries) {
  return {
    "GET /api/projects": () => {
      return Response.json(queries.listProjects());
    },

    "POST /api/projects": async (req: Request) => {
      const { name } = (await req.json()) as { name: string };
      if (!name) return new Response("name required", { status: 400 });
      const project = queries.createProject(crypto.randomUUID(), name);
      return Response.json(project, { status: 201 });
    },

    "DELETE /api/projects/:id": (_req: Request, params: { id: string }) => {
      queries.deleteProject(params.id);
      return new Response(null, { status: 204 });
    },
  };
}
