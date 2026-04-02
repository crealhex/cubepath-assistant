import { listTemplates } from "cubepath-tools";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerListTemplates(server: McpServer) {
  server.registerTool(
    listTemplates.name,
    {
      title: "List Available Templates",
      description: listTemplates.description,
      inputSchema: listTemplates.schema,
    },
    async () => {
      const result = await listTemplates.execute({}, { apiKey: process.env.CUBEPATH_API_KEY! });
      return {
        content: [{ type: "text" as const, text: result }],
      };
    },
  );
}
