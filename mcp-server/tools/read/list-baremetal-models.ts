import { z } from "zod/v4";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const BaremetalModel = z.object({
  model_name: z.string(),
  monthly_price: z.number(),
  discount_value: z.number(),
  discount_type: z.string(),
  cpu: z.string(),
  disk_type: z.string(),
  ram_type: z.string(),
  port: z.number(),
  bandwidth: z.number(),
  setup: z.number(),
  disk_size: z.string(),
  ram_size: z.number(),
  cpu_specs: z.string(),
  kvm: z.string(),
  cpu_bench: z.number(),
  stock_available: z.number(),
});

const Location = z.object({
  location_name: z.string(),
  description: z.string(),
  baremetal_models: z.array(BaremetalModel),
});

const pricing = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "../../data/pricing.json"), "utf-8"),
);
const baremetalLocations = z.array(Location).parse(pricing.baremetal?.locations ?? []);

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
      const filtered = location
        ? baremetalLocations.filter((l) => l.location_name === location)
        : baremetalLocations;

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
