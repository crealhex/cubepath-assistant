import { z, type z as Z } from "zod/v4";

// --- Auth context for tools that need it ---

export interface AuthContext {
  apiKey: string;
}

// --- Base shape shared by all tools ---

interface BaseTool {
  name: string;
  description: string;
  schema: Z.ZodObject<Z.ZodRawShape>;
}

// --- Tool kinds ---

export type ComputationTool = BaseTool & {
  kind: "computation";
  execute(args: Record<string, unknown>): Promise<string>;
};

export type ReadTool = BaseTool & {
  kind: "read";
  execute(args: Record<string, unknown>): Promise<string>;
};

export type AuthReadTool = BaseTool & {
  kind: "auth-read";
  execute(args: Record<string, unknown>, context: AuthContext): Promise<string>;
};

export type AuthWriteTool = BaseTool & {
  kind: "auth-write";
  execute(args: Record<string, unknown>, context: AuthContext): Promise<string>;
};

// --- Union type for registries ---

export type Tool = ComputationTool | ReadTool | AuthReadTool | AuthWriteTool;

// --- Helpers ---

export function toJSONSchema(tool: Tool) {
  return z.toJSONSchema(tool.schema);
}
