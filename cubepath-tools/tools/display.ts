import { z } from "zod/v4";
import type { Tool } from "../types";

export const display: Tool = {
  name: "display",
  description: "Send component data to hydrate a token you placed in your text. IMPORTANT: You MUST first write the token (e.g. {{location-picker:0}}) in your text response, THEN call this tool with matching id and props. The token creates a placeholder in the chat — this tool fills it with data. Without the token in your text, calling this tool does nothing visible. Call this in the SAME turn as your text, not in a separate turn.",
  schema: z.object({
    id: z.string().describe("Token ID matching your text token (e.g. 'location-picker:0')"),
    component: z.string().describe("Component name (e.g. 'location-picker', 'instance-card')"),
    props: z.record(z.string(), z.unknown()).describe("Component props as a JSON object"),
  }),
  async execute() {
    return "displayed";
  },
};
