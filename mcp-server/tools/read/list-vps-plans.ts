import { listVpsPlans } from "cubepath-tools";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerListVpsPlans(server: McpServer) {
  server.registerTool(
    listVpsPlans.name,
    {
      title: "List VPS Plans",
      description: listVpsPlans.description,
      inputSchema: listVpsPlans.schema,
    },
    async () => {
      const result = await listVpsPlans.execute({});
      return {
        content: [{ type: "text" as const, text: result }],
      };
    },
  );
}
