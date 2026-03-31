export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  execute(args: Record<string, unknown>): Promise<string>;
}

const tools = new Map<string, ToolDefinition>();

export function register(tool: ToolDefinition) {
  tools.set(tool.name, tool);
}

/** OpenAI function calling format */
export function getDefinitions() {
  return [...tools.values()].map((t) => ({
    type: "function" as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters,
    },
  }));
}

export async function execute(name: string, args: Record<string, unknown>): Promise<string> {
  const tool = tools.get(name);
  if (!tool) return `Unknown tool: ${name}`;
  return tool.execute(args);
}
