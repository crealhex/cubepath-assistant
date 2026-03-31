import { getQueryTool } from "../services/tools";

export function toolRoutes() {
  return {
    "GET /api/tools/:name": async (req: Request, params: { name: string }) => {
      const tool = getQueryTool(params.name);
      if (!tool) {
        return Response.json({ error: `Tool '${params.name}' not found` }, { status: 404 });
      }

      const url = new URL(req.url);
      const args: Record<string, string> = {};
      for (const [key, value] of url.searchParams) {
        args[key] = value;
      }

      try {
        const result = await tool.execute(args);
        return new Response(result, {
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Tool execution failed";
        return Response.json({ error: message }, { status: 500 });
      }
    },
  };
}
