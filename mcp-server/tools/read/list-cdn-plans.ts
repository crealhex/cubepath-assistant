import { z } from "zod/v4";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const pricing = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "../../data/pricing.json"), "utf-8"),
);

export function registerListCdnPlans(server: McpServer) {
  server.registerTool(
    "list-cdn-plans",
    {
      title: "List CDN Plans",
      description: "List available CDN plans with pricing, zones, origins, and rules limits",
      inputSchema: z.object({}),
    },
    async () => {
      const plans = pricing.cdn?.plans ?? [];

      return {
        content: [{
          type: "text" as const,
          text: plans.length === 0
            ? "No CDN plans found."
            : JSON.stringify(plans, null, 2),
        }],
      };
    },
  );
}
