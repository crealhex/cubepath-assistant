import { z } from "zod/v4";
import { getCubePathClient } from "../../sdk/client";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerDestroyInstance(server: McpServer) {
  server.registerTool(
    "destroy-instance",
    {
      title: "Destroy Instance",
      description: "Destroy a VPS instance permanently (simple mode, no Terraform state tracking). This action is irreversible.",
      inputSchema: z.object({
        instanceId: z.string().describe("The VPS instance ID to destroy"),
        releaseIPs: z.boolean().optional().describe("Release associated floating IPs (default: false)"),
      }),
    },
    async ({ instanceId, releaseIPs }) => {
      const client = getCubePathClient();
      await client.vps.destroy(instanceId, releaseIPs);

      return {
        content: [{
          type: "text" as const,
          text: `Instance ${instanceId} has been destroyed.`,
        }],
      };
    },
  );
}
