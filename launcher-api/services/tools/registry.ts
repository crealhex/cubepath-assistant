import { toJSONSchema, type Tool, type ToolContext } from "cubepath-tools";

const tools = new Map<string, Tool>();
const queryTools = new Set<string>();

export function registerQuery(tool: Tool) {
  tools.set(tool.name, tool);
  queryTools.add(tool.name);
}

export function registerCommand(tool: Tool) {
  tools.set(tool.name, tool);
}

/** OpenAI function calling format */
export function getDefinitions() {
  return [...tools.values()].map((t) => ({
    type: "function" as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: toJSONSchema(t),
    },
  }));
}

export async function execute(name: string, args: Record<string, unknown>, context: ToolContext): Promise<string> {
  const tool = tools.get(name);
  if (!tool) return `Unknown tool: ${name}`;
  return tool.execute(args, context);
}

export function isQuery(name: string): boolean {
  return queryTools.has(name);
}

export function getQueryTool(name: string): Tool | undefined {
  if (!queryTools.has(name)) return undefined;
  return tools.get(name);
}
