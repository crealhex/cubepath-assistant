import { listBaremetalModels } from "cubepath-tools";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerListBaremetalModels(server: McpServer) {
  server.registerTool(
    listBaremetalModels.name,
    {
      title: "List Baremetal Models",
      description: listBaremetalModels.description,
      inputSchema: listBaremetalModels.schema,
    },
    async (args) => {
      const result = await listBaremetalModels.execute(args);
      return {
        content: [{ type: "text" as const, text: result }],
      };
    },
  );
}
