import { getQueryTool } from "../services/tools";
import type { Queries } from "../db/queries";

export function toolRoutes(queries: Queries) {
  return {
    "GET /api/tools/:name": async (req: Request, params: { name: string; _userId: string }) => {
      const tool = getQueryTool(params.name);
      if (!tool) {
        return Response.json({ error: `Tool '${params.name}' not found` }, { status: 404 });
      }

      const url = new URL(req.url);
      const args: Record<string, string> = {};
      for (const [key, value] of url.searchParams) {
        args[key] = value;
      }

      const settings = queries.getSettings(params._userId);

      try {
        const result = await tool.execute(args, { apiKey: settings.cubepath_api_key });
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
