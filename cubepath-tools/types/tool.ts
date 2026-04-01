import { z, type z as Z } from "zod/v4";

export interface ToolContext {
  apiKey: string;
  confirmed?: boolean;
}

export interface Tool {
  name: string;
  description: string;
  schema: Z.ZodObject<Z.ZodRawShape>;
  execute(args: Record<string, unknown>, context: ToolContext): Promise<string>;
}

export function toJSONSchema(tool: Tool) {
  return z.toJSONSchema(tool.schema);
}
