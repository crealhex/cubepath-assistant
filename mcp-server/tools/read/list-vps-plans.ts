import { z } from "zod/v4";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const pricing = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "../../data/pricing.json"), "utf-8"),
);

export function registerListVpsPlans(server: McpServer) {
  server.registerTool(
    "list-vps-plans",
    {
      title: "List VPS Plans",
      description: "List available VPS plans with specs and pricing, grouped by location and cluster",
      inputSchema: z.object({
        location: z.string().optional().describe("Filter by location name (e.g. 'eu-bcn-1')"),
      }),
    },
    async ({ location }) => {
      const locations = pricing.vps?.locations ?? [];
      const filtered = location
        ? locations.filter((l: Record<string, unknown>) => l.location_name === location)
        : locations;

      return {
        content: [{
          type: "text" as const,
          text: filtered.length === 0
            ? `No VPS plans found${location ? ` for location '${location}'` : ""}.`
            : JSON.stringify(filtered, null, 2),
        }],
      };
    },
  );
}
