export interface ToolSpec {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, { type: string; description?: string; items?: unknown; enum?: string[] }>;
    required?: string[];
  };
}

export interface Tool {
  spec: ToolSpec;
  execute(args: Record<string, unknown>): Promise<string>;
}
