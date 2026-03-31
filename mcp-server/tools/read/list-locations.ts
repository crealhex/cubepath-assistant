import { listLocations } from "cubepath-tools";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerListLocations(server: McpServer) {
  server.registerTool(
    listLocations.name,
    {
      title: "List Locations",
      description: listLocations.description,
      inputSchema: listLocations.schema,
    },
    async () => {
      const result = await listLocations.execute({});
      return {
        content: [{ type: "text" as const, text: result }],
      };
    },
  );
}
