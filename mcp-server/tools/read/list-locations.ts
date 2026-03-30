import { z } from "zod/v4";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const locations = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "../../data/locations.json"), "utf-8"),
);

export function registerListLocations(server: McpServer) {
  server.registerTool(
    "list-locations",
    {
      title: "List Locations",
      description: "List all available CubePath datacenter locations and their supported services",
      inputSchema: z.object({}),
    },
    async () => ({
      content: [{
        type: "text" as const,
        text: JSON.stringify(locations, null, 2),
      }],
    }),
  );
}
