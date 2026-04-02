import { z } from "zod/v4";
import { evaluate } from "mathjs";
import type { ComputationTool } from "../types";

export const calculate: ComputationTool = {
  name: "calculate",
  kind: "computation",
  description: "Evaluate a mathematical expression safely. Use for cost projections, comparisons, unit conversions, and any arithmetic. Use ^ for power (not **), sqrt() for square root, log() for logarithm. Examples: '4.06 * 12', 'sqrt(144) + 2^10', 'round(495 * 0.7, 2)'",
  schema: z.object({
    expression: z.string().describe("Math expression to evaluate"),
  }),
  async execute(args) {
    try {
      const result = evaluate(args.expression as string);
      return `${args.expression} = ${result}`;
    } catch (err) {
      return `Error: ${err instanceof Error ? err.message : "Invalid expression"}`;
    }
  },
};
