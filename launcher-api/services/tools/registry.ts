import { toJSONSchema, type Tool } from "cubepath-tools";

const tools = new Map<string, Tool>();

export function register(tool: Tool) {
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

export async function execute(name: string, args: Record<string, unknown>): Promise<string> {
  const tool = tools.get(name);
  if (!tool) return `Unknown tool: ${name}`;
  return tool.execute(args);
}
