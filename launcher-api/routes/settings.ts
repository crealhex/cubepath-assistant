import type { Queries } from "../db/queries";

export function settingsRoutes(queries: Queries) {
  return {
    "GET /api/settings": () => {
      const settings = queries.getSettings();
      // Mask sensitive values for the response
      const masked = { ...settings };
      if (masked.openai_api_key) {
        masked.openai_api_key = masked.openai_api_key.slice(0, 7) + "..." ;
      }
      if (masked.cubepath_token) {
        masked.cubepath_token = masked.cubepath_token.slice(0, 7) + "...";
      }
      return Response.json(masked);
    },

    "PUT /api/settings": async (req: Request) => {
      const body = (await req.json()) as Record<string, string>;
      queries.setSettings(body);
      return Response.json({ ok: true });
    },
  };
}
