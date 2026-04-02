import { listInstances } from "cubepath-tools";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerListInstances(server: McpServer) {
  server.registerTool(
    listInstances.name,
    {
      title: "List All Instances",
      description: listInstances.description,
      inputSchema: listInstances.schema,
    },
    async () => {
      const result = await listInstances.execute({}, { apiKey: process.env.CUBEPATH_API_KEY! });
      return {
        content: [{ type: "text" as const, text: result }],
      };
    },
  );
}
