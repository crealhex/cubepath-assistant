import { listSshKeys } from "cubepath-tools";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerListSshKeys(server: McpServer) {
  server.registerTool(
    listSshKeys.name,
    {
      title: "List SSH Keys",
      description: listSshKeys.description,
      inputSchema: listSshKeys.schema,
    },
    async () => {
      const result = await listSshKeys.execute({}, { apiKey: process.env.CUBEPATH_API_KEY! });
      return {
        content: [{ type: "text" as const, text: result }],
      };
    },
  );
}
