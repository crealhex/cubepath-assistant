import type { Tool, AuthContext } from "cubepath-tools";

export function dispatch(tool: Tool, args: Record<string, unknown>, auth?: AuthContext): Promise<string> {
  switch (tool.kind) {
    case "computation":
    case "read":
      return tool.execute(args);
    case "auth-read":
    case "auth-write":
      if (!auth?.apiKey) throw new Error(`Tool "${tool.name}" requires an API key but none was provided.`);
      return tool.execute(args, auth);
    default: {
      const _exhaustive: never = tool;
      throw new Error("Unknown tool kind");
    }
  }
}
