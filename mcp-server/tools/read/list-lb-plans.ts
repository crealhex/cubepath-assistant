import { listLbPlans } from "cubepath-tools";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerListLbPlans(server: McpServer) {
  server.registerTool(
    listLbPlans.name,
    {
      title: "List Load Balancer Plans",
      description: listLbPlans.description,
      inputSchema: listLbPlans.schema,
    },
    async (args) => {
      const result = await listLbPlans.execute(args);
      return {
        content: [{ type: "text" as const, text: result }],
      };
    },
  );
}
