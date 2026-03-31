import { z } from "zod/v4";
import { getCubePathClient } from "cubepath-tools";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerDestroyInstance(server: McpServer) {
  server.registerTool(
    "destroy-instance",
    {
      title: "Destroy Instance",
      description: "Destroy a VPS instance permanently. This action is irreversible. Cannot destroy instances that are still deploying — wait until status is 'active' or 'stopped' first.",
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
