import { getInstanceStatus } from "cubepath-tools";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGetStatus(server: McpServer) {
  server.registerTool(
    getInstanceStatus.name,
    {
      title: "Get Instance Status",
      description: getInstanceStatus.description,
      inputSchema: getInstanceStatus.schema,
    },
    async (args) => {
      const result = await getInstanceStatus.execute(args, { apiKey: process.env.CUBEPATH_API_KEY! });
      return {
        content: [{ type: "text" as const, text: result }],
      };
    },
  );
}
