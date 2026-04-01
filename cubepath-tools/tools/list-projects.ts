import { z } from "zod/v4";
import { getCubePathClient } from "../sdk";
import type { Tool } from "../types";

interface ProjectEntry {
  project: { id: number; name: string; description: string; created_at: string };
  vps: unknown[];
}

export const listProjects: Tool = {
  name: "list-projects",
  description: "List all CubePath projects in the account. Returns project ID, name, description, and VPS count.",
  schema: z.object({}),
  async execute(_args, context) {
    const client = getCubePathClient(context.apiKey);
    const projects = await client.projects.list() as unknown as ProjectEntry[];

    if (projects.length === 0) return JSON.stringify([]);

    return JSON.stringify(projects.map((p) => ({
      id: p.project.id,
      name: p.project.name,
      description: p.project.description,
      created_at: p.project.created_at,
      vps_count: p.vps?.length ?? 0,
    })), null, 2);
  },
};
