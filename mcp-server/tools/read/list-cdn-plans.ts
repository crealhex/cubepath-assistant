import { z } from "zod/v4";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const CdnPlan = z.object({
  uuid: z.string(),
  name: z.string(),
  description: z.string(),
  price_per_gb: z.record(z.string(), z.number()),
  base_price_per_hour: z.number(),
  max_zones: z.number(),
  max_origins_per_zone: z.number(),
  max_rules_per_zone: z.number(),
  custom_ssl_allowed: z.boolean(),
});

const pricing = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "../../data/pricing.json"), "utf-8"),
);
const cdnPlans = z.array(CdnPlan).parse(pricing.cdn?.plans ?? []);

export function registerListCdnPlans(server: McpServer) {
  server.registerTool(
    "list-cdn-plans",
    {
      title: "List CDN Plans",
      description: "List available CDN plans with pricing, zones, origins, and rules limits",
      inputSchema: z.object({}),
    },
    async () => ({
      content: [{
        type: "text" as const,
        text: cdnPlans.length === 0
          ? "No CDN plans found."
          : JSON.stringify(cdnPlans, null, 2),
      }],
    }),
  );
}
