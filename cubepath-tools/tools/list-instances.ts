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

export const listInstances: Tool = {
  name: "list-instances",
  description: "List all VPS instances across all projects. Returns ID, name, status, IP, plan details, location, template, and creation date. Use when the user asks about their servers, instances, or deployments.",
  schema: z.object({}),
  async execute(_args, context) {
    const client = getCubePathClient(context.apiKey);
    const projects = await client.vps.list() as unknown as ProjectEntry[];

    const instances = projects.flatMap((p) =>
      p.vps.map((v) => ({
        id: v.id,
        name: v.name,
        status: v.status,
        project: p.project.name,
        ip: v.ipv4 || v.ipv6 || null,
        plan: v.plan,
        location: v.location.location_name,
        template: v.template.template_name,
        os: v.template.os_name,
        created_at: v.created_at,
      })),
    );

    if (instances.length === 0) return JSON.stringify([]);
    return JSON.stringify(instances, null, 2);
  },
};
