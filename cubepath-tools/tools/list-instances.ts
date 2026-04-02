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

export const listInstances: AuthReadTool = {
  name: "list-instances",
  kind: "auth-read",
  description: "List all VPS instances across all projects. Returns full instance details including plan, location, template, network, and SSH keys.",
  schema: z.object({}),
  async execute(_args, context) {
    const client = getCubePathClient(context.apiKey);
    const projects = await client.vps.list() as unknown as ProjectEntry[];

    const instances = projects.flatMap((p) =>
      p.vps.map((v) => ({
        id: v.id,
        name: v.name,
        label: v.label,
        status: v.status,
        user: v.user,
        project: { id: p.project.id, name: p.project.name },
        ip: v.ipv4 || v.ipv6 || null,
        ipv4: v.ipv4,
        ipv6: v.ipv6,
        floating_ips: v.floating_ips,
        plan: v.plan,
        location: v.location,
        template: v.template,
        network: v.network,
        ssh_keys: v.ssh_keys,
        created_at: v.created_at,
      })),
    );

    if (instances.length === 0) return JSON.stringify([]);
    return JSON.stringify(instances, null, 2);
  },
};
