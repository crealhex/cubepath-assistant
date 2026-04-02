import { z } from "zod/v4";
import { getCubePathClient } from "../sdk";
import type { AuthReadTool } from "../types";

interface VpsInstance {
  id: number;
  name: string;
  label?: string;
  project_id: string;
  status: string;
  user: string;
  ipv4: string;
  ipv6: string;
  floating_ips?: string;
  plan: { id: string; plan_name: string; cpu: number; ram: number; storage: number; bandwidth: number; price_per_hour: number };
  location: { id: string; location_name: string; description: string };
  template: { id: string; template_name: string; os_name: string; version: string };
  network?: { id: string; name: string; assigned_ip: string };
  ssh_keys?: string[];
  created_at: string;
}

interface ProjectEntry {
  project: { id: number; name: string; description: string };
  vps: VpsInstance[];
}

export const getInstanceStatus: AuthReadTool = {
  name: "get-instance-status",
  kind: "auth-read",
  description: "Get detailed status of a SINGLE VPS instance by ID. Only for focused analysis on one specific instance. For general overview of all instances use list-instances instead.",
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
          label: vps.label,
          status: vps.status,
          user: vps.user,
          project: { id: p.project.id, name: p.project.name },
          ip: vps.ipv4 || vps.ipv6 || null,
          ipv4: vps.ipv4,
          ipv6: vps.ipv6,
          floating_ips: vps.floating_ips,
          plan: vps.plan,
          location: vps.location,
          template: vps.template,
          network: vps.network,
          ssh_keys: vps.ssh_keys,
          created_at: vps.created_at,
        }, null, 2);
      }
    }

    return JSON.stringify({ error: `VPS instance ${args.instanceId} not found` });
  },
};
