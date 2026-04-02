import { powerAction } from "cubepath-tools";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerPowerAction(server: McpServer) {
  server.registerTool(
    powerAction.name,
    {
      title: "Power Action",
      description: powerAction.description,
      inputSchema: powerAction.schema,
    },
    async (args) => {
      const result = await powerAction.execute(args, { apiKey: process.env.CUBEPATH_API_KEY! });
      return {
        content: [{ type: "text" as const, text: result }],
      };
    },
  );
}
