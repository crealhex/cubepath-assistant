import { z } from "zod/v4";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const pricing = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "../../data/pricing.json"), "utf-8"),
);

export function registerListBaremetalModels(server: McpServer) {
  server.registerTool(
    "list-baremetal-models",
    {
      title: "List Baremetal Models",
      description: "List available dedicated baremetal server models with specs and pricing, grouped by location",
      inputSchema: z.object({
        location: z.string().optional().describe("Filter by location name (e.g. 'eu-bcn-1')"),
      }),
    },
    async ({ location }) => {
      const locations = pricing.baremetal?.locations ?? [];
      const filtered = location
        ? locations.filter((l: Record<string, unknown>) => l.location_name === location)
        : locations;

      return {
        content: [{
          type: "text" as const,
          text: filtered.length === 0
            ? `No baremetal models found${location ? ` for location '${location}'` : ""}.`
            : JSON.stringify(filtered, null, 2),
        }],
      };
    },
  );
}
