import { toJSONSchema, type Tool } from "cubepath-tools";
import { dispatch } from "./dispatch";

export type PermissionTier = "safe" | "write" | "destructive";

const tools = new Map<string, Tool>();
const toolTiers = new Map<string, PermissionTier>();
const queryTools = new Set<string>();

export function registerSafe(tool: Tool) {
  tools.set(tool.name, tool);
  toolTiers.set(tool.name, "safe");
  queryTools.add(tool.name);
}

export function registerWrite(tool: Tool) {
  tools.set(tool.name, tool);
  toolTiers.set(tool.name, "write");
}

export function registerDestructive(tool: Tool) {
  tools.set(tool.name, tool);
  toolTiers.set(tool.name, "destructive");
}

const tierLevel: Record<PermissionTier, number> = { safe: 0, write: 1, destructive: 2 };

/** OpenAI function calling format — filtered by permission tier */
export function getDefinitions(maxTier: PermissionTier = "destructive") {
  const max = tierLevel[maxTier];
  return [...tools.entries()]
    .filter(([name]) => tierLevel[toolTiers.get(name) ?? "safe"] <= max)
    .map(([, t]) => ({
      type: "function" as const,
      function: {
        name: t.name,
        description: t.description,
        parameters: toJSONSchema(t),
      },
    }));
}

export async function execute(name: string, args: Record<string, unknown>, apiKey?: string, maxTier: PermissionTier = "destructive", confirmed = false): Promise<string> {
  const tool = tools.get(name);
  if (!tool) return `Unknown tool: ${name}`;

  const tier = toolTiers.get(name) ?? "safe";
  if (tierLevel[tier] > tierLevel[maxTier]) {
    return `Permission denied: "${name}" requires "${tier}" mode but current mode is "${maxTier}".`;
  }

  if (tier !== "safe" && !confirmed) {
    return `Action "${name}" requires user approval. Show an approval card and wait for explicit confirmation.`;
  }

  return dispatch(tool, args, apiKey ? { apiKey } : undefined);
}

export function getToolTier(name: string): PermissionTier {
  return toolTiers.get(name) ?? "safe";
}

export function isQuery(name: string): boolean {
  return queryTools.has(name);
}

export function getQueryTool(name: string): Tool | undefined {
  if (!queryTools.has(name)) return undefined;
  return tools.get(name);
}
