import { listCdnPlans } from "cubepath-tools";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerListCdnPlans(server: McpServer) {
  server.registerTool(
    listCdnPlans.name,
    {
      title: "List CDN Plans",
      description: listCdnPlans.description,
      inputSchema: listCdnPlans.schema,
    },
    async () => {
      const result = await listCdnPlans.execute({});
      return {
        content: [{ type: "text" as const, text: result }],
      };
    },
  );
}
