import { z } from "zod/v4";
import { evaluate } from "mathjs";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerCalculate(server: McpServer) {
  server.registerTool(
    "calculate",
    {
      title: "Calculate",
      description: "Evaluate a mathematical expression safely. Use for cost projections, comparisons, unit conversions, and any arithmetic. Use ^ for power (not **), sqrt() for square root, log() for logarithm. Examples: '4.06 * 12', 'sqrt(144) + 2^10', 'round(495 * 0.7, 2)'",
      inputSchema: z.object({
        expression: z.string().describe("Math expression to evaluate (e.g. '4.06 * 12 + 8.11 * 12')"),
      }),
    },
    async ({ expression }) => {
      try {
        const result = evaluate(expression);
        return {
          content: [{
            type: "text" as const,
            text: `${expression} = ${result}`,
          }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Invalid expression";
        return {
          content: [{
            type: "text" as const,
            text: `Error evaluating "${expression}": ${message}`,
          }],
          isError: true,
        };
      }
    },
  );
}
