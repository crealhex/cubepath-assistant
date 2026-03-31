import { calculate } from "cubepath-tools";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerCalculate(server: McpServer) {
  server.registerTool(
    calculate.name,
    {
      title: "Calculate",
      description: calculate.description,
      inputSchema: calculate.schema,
    },
    async (args) => {
      const result = await calculate.execute(args);
      return {
        content: [{ type: "text" as const, text: result }],
        ...(result.startsWith("Error") && { isError: true }),
      };
    },
  );
}
