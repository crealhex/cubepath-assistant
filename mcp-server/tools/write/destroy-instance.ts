import { destroyInstance } from "cubepath-tools";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerDestroyInstance(server: McpServer) {
  server.registerTool(
    destroyInstance.name,
    {
      title: "Destroy Instance",
      description: destroyInstance.description,
      inputSchema: destroyInstance.schema,
      annotations: { destructiveHint: true },
    },
    async (args) => {
      const result = await destroyInstance.execute(args, { apiKey: process.env.CUBEPATH_API_KEY! });
      return {
        content: [{ type: "text" as const, text: result }],
      };
    },
  );
}
