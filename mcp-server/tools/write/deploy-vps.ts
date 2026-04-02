import { deployVps } from "cubepath-tools";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerDeployVps(server: McpServer) {
  server.registerTool(
    deployVps.name,
    {
      title: "Deploy VPS",
      description: deployVps.description,
      inputSchema: deployVps.schema,
    },
    async (args) => {
      const result = await deployVps.execute(args, { apiKey: process.env.CUBEPATH_API_KEY! });
      return {
        content: [{ type: "text" as const, text: result }],
      };
    },
  );
}
