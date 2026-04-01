import type { AiGateway, AiProvider } from "../types";
import type { PermissionTier } from "./tools/registry";
import { createMockGateway } from "./gateways/mock";
import { createCubePathGateway } from "./gateways/cubepath/gateway";
import { createClaudeCliGateway } from "./gateways/claude-cli";

export function resolveGateway(
  provider: AiProvider,
  settings: Record<string, string>,
): AiGateway {
  const permissionTier = (settings.permission_tier || "safe") as PermissionTier;
  switch (provider) {
    case "cubepath":
      return createCubePathGateway(
        settings.cubepath_api_key,
        settings.ai_model || "deepseek/deepseek-chat",
        settings.cubepath_gateway_url,
        permissionTier,
      );
    case "claude-cli":
      return createClaudeCliGateway(settings.claude_cli_path);
    case "mock":
    default:
      return createMockGateway();
  }
}
