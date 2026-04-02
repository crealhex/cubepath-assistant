import { z } from "zod/v4";
import { getCubePathClient } from "../sdk";
import type { Tool } from "../types";

export const destroyInstance: Tool = {
  name: "destroy-instance",
  description: "Permanently destroy a VPS instance. IRREVERSIBLE. Cannot destroy instances still deploying — wait until active or stopped. Always show an approval card and get explicit user confirmation before calling.",
  schema: z.object({
    instanceId: z.string().describe("The VPS instance ID to destroy"),
    releaseIPs: z.boolean().optional().describe("Release associated floating IPs (default: false)"),
  }),
  async execute(args, context) {
    const client = getCubePathClient(context.apiKey);
    await client.vps.destroy(args.instanceId as string, args.releaseIPs as boolean | undefined);
    return JSON.stringify({ destroyed: true, instanceId: args.instanceId });
  },
};
