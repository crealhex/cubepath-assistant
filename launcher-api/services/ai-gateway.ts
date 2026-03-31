import type { AiGateway, AiProvider } from "../types";
import { createMockGateway } from "./gateways/mock";
import { createOpenAiGateway } from "./gateways/openai/gateway";
import { createClaudeCliGateway } from "./gateways/claude-cli";

export function resolveGateway(
  provider: AiProvider,
  settings: Record<string, string>,
): AiGateway {
  switch (provider) {
    case "openai":
      return createOpenAiGateway(
        settings.openai_api_key,
        settings.ai_model || "gpt-4o",
        settings.openai_base_url,
      );
    case "claude-cli":
      return createClaudeCliGateway(settings.claude_cli_path);
    case "mock":
    default:
      return createMockGateway();
  }
}
