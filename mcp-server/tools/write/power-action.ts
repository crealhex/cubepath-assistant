import { z } from "zod/v4";
import { getCubePathClient } from "cubepath-tools";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerPowerAction(server: McpServer) {
  server.registerTool(
    "power-action",
    {
      title: "Power Action",
      description: "Perform a power action on a VPS instance (start, stop, reboot, shutdown)",
      inputSchema: z.object({
        instanceId: z.string().describe("The VPS instance ID"),
        action: z.enum(["start_vps", "stop_vps", "restart_vps", "reset_vps"]).describe("The power action to perform (start_vps, stop_vps, restart_vps, reset_vps)"),
      }),
    },
    async ({ instanceId, action }) => {
      const client = getCubePathClient();
      await client.vps.power(instanceId, action);

      return {
        content: [{
          type: "text" as const,
          text: `Power action '${action}' executed on instance ${instanceId}.`,
        }],
      };
    },
  );
}
