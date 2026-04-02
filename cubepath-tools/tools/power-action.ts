import { z } from "zod/v4";
import { getCubePathClient } from "../sdk";
import type { AuthWriteTool } from "../types";

export const powerAction: AuthWriteTool = {
  name: "power-action",
  kind: "auth-write",
  description: "Perform a power action on a VPS instance. Use for starting, stopping, or restarting servers. Always confirm with the user before executing.",
  schema: z.object({
    instanceId: z.string().describe("The VPS instance ID"),
    action: z.enum(["start_vps", "stop_vps", "restart_vps", "reset_vps"]).describe("The power action: start_vps, stop_vps, restart_vps, or reset_vps"),
  }),
  async execute(args, context) {
    const client = getCubePathClient(context.apiKey);
    await client.vps.power(args.instanceId as string, args.action as "start_vps" | "stop_vps" | "restart_vps" | "reset_vps");
    return JSON.stringify({ success: true, instanceId: args.instanceId, action: args.action });
  },
};
