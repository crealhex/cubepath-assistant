import { z } from "zod/v4";
import { getCubePathClient } from "../sdk";
import type { Tool } from "../types";

interface VpsInstance {
  id: number;
  name: string;
  status: string;
  ipv4: string;
  ipv6: string;
  plan: { plan_name: string; cpu: number; ram: number; storage: number; bandwidth: number; price_per_hour: string };
  location: { location_name: string; description: string };
  template: { template_name: string; os_name: string };
  created_at: string;
}

interface ProjectEntry {
  project: { id: number; name: string };
  vps: VpsInstance[];
}

export const getInstanceStatus: Tool = {
  name: "get-instance-status",
  description: "Get detailed status of a SINGLE VPS instance by ID. Use this for focused analysis on one specific instance. For listing all instances use list-instances instead. Requires the instance ID number.",
  schema: z.object({
    instanceId: z.string().describe("The VPS instance ID"),
  }),
  async execute(args, context) {
    const client = getCubePathClient(context.apiKey);
    const projects = await client.vps.list() as unknown as ProjectEntry[];

    const numId = Number(args.instanceId);
    for (const p of projects) {
      const vps = p.vps.find((v) => v.id === numId);
      if (vps) {
        return JSON.stringify({
          id: vps.id,
          name: vps.name,
          status: vps.status,
          project: p.project.name,
          ip: vps.ipv4 || vps.ipv6 || null,
          plan: vps.plan,
          location: vps.location.location_name,
          template: vps.template.template_name,
          os: vps.template.os_name,
          created_at: vps.created_at,
        }, null, 2);
      }
    }

    return JSON.stringify({ error: `VPS instance ${args.instanceId} not found` });
  },
};
