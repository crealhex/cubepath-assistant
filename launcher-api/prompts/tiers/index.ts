import { safePrompt } from "./safe";
import { writePrompt } from "./write";
import { destructivePrompt } from "./destructive";

export function getTierPrompt(tier: string): string {
  switch (tier) {
    case "destructive":
      return [safePrompt, writePrompt, destructivePrompt].join("\n\n");
    case "write":
      return [safePrompt, writePrompt].join("\n\n");
    case "safe":
    default:
      return safePrompt;
  }
}
