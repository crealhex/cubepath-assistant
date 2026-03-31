import { initDb } from "./db/schema";
import { createQueries } from "./db/queries";
import { createChatService } from "./services/chat-service";
import { projectRoutes } from "./routes/projects";
import { chatRoutes } from "./routes/chats";
import { aiRoutes } from "./routes/ai";
import { settingsRoutes } from "./routes/settings";

const db = initDb();
const queries = createQueries(db);
const chatService = createChatService(queries);

// Collect all route handlers
const routes = {
  ...projectRoutes(queries),
  ...chatRoutes(queries),
  ...aiRoutes(chatService),
  ...settingsRoutes(queries),
};

type RouteKey = keyof typeof routes;

// Simple router: match "METHOD /path/:param" patterns
function matchRoute(method: string, pathname: string): { handler: Function; params: Record<string, string> } | null {
  for (const [pattern, handler] of Object.entries(routes)) {
    const [routeMethod, routePath] = pattern.split(" ");
    if (routeMethod !== method) continue;

    const routeParts = routePath.split("/");
    const pathParts = pathname.split("/");
    if (routeParts.length !== pathParts.length) continue;

    const params: Record<string, string> = {};
    let match = true;

    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(":")) {
        params[routeParts[i].slice(1)] = pathParts[i];
      } else if (routeParts[i] !== pathParts[i]) {
        match = false;
        break;
      }
    }

    if (match) return { handler, params };
  }
  return null;
}

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "0.0.0.0";

Bun.serve({
  port: PORT,
  hostname: HOST,
  idleTimeout: 120,
  async fetch(req) {
    // CORS
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const url = new URL(req.url);
    const matched = matchRoute(req.method, url.pathname);

    if (!matched) {
      return new Response("Not Found", { status: 404 });
    }

    try {
      const response = await matched.handler(req, matched.params);
      // Add CORS headers to all responses
      response.headers.set("Access-Control-Allow-Origin", "*");
      return response;
    } catch (err) {
      console.error("Route error:", err);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  },
});

console.log(`launcher-api running on http://${HOST}:${PORT}`);
