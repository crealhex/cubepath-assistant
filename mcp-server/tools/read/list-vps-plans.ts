import { z } from "zod/v4";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const VpsPlan = z.object({
  plan_name: z.string(),
  ram: z.number(),
  cpu: z.number(),
  storage: z.number(),
  bandwidth: z.number(),
  price_per_hour: z.string(),
  status: z.number(),
});

const Cluster = z.object({
  cluster_name: z.string(),
  type: z.string(),
  plans: z.array(VpsPlan),
});

const Location = z.object({
  location_name: z.string(),
  description: z.string(),
  clusters: z.array(Cluster),
});

const pricing = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "../../data/pricing.json"), "utf-8"),
);
const vpsLocations = z.array(Location).parse(pricing.vps?.locations ?? []);

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
      const filtered = location
        ? vpsLocations.filter((l) => l.location_name === location)
        : vpsLocations;

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
