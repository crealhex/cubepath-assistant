import { listProjects } from "cubepath-tools";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerListProjects(server: McpServer) {
  server.registerTool(
    listProjects.name,
    {
      title: "List Projects",
      description: listProjects.description,
      inputSchema: listProjects.schema,
    },
    async () => {
      const result = await listProjects.execute({}, { apiKey: process.env.CUBEPATH_API_KEY! });
      return {
        content: [{ type: "text" as const, text: result }],
      };
    },
  );
}
