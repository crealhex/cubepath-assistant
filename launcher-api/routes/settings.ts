import type { Queries } from "../db/queries";

export function settingsRoutes(queries: Queries) {
  return {
    "GET /api/settings": (_req: Request, params: { _userId: string }) => {
      const settings = queries.getSettings(params._userId);
      const masked = { ...settings };
      if (masked.cubepath_api_key) {
        masked.cubepath_api_key = masked.cubepath_api_key.slice(0, 7) + "...";
      }
      return Response.json(masked);
    },

    "PUT /api/settings": async (req: Request, params: { _userId: string }) => {
      const body = (await req.json()) as Record<string, string>;
      queries.setSettings(params._userId, body);
      return Response.json({ ok: true });
    },
  };
}
