import { z } from "zod/v4";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const pricing = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "../../data/pricing.json"), "utf-8"),
);

export function registerListPricing(server: McpServer) {
  server.registerTool(
    "list-pricing",
    {
      title: "List Pricing",
      description: "List all available VPS and baremetal plans with pricing information",
      inputSchema: z.object({}),
    },
    async () => ({
      content: [{
        type: "text" as const,
        text: JSON.stringify(pricing, null, 2),
      }],
    }),
  );
}
