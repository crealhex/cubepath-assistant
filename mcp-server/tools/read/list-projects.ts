import { z } from "zod/v4";
import { getCubePathClient } from "../../sdk/client";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/** The SDK types are flat, but the API actually nests project data under a `project` key */
interface ProjectEntry {
  project: { id: number; name: string; description: string; created_at: string };
  networks: unknown[];
  baremetals: unknown[];
  vps: unknown[];
}

export function registerListProjects(server: McpServer) {
  server.registerTool(
    "list-projects",
    {
      title: "List Projects",
      description: "List all CubePath projects in the account",
      inputSchema: z.object({}),
    },
    async () => {
      const client = getCubePathClient();
      const projects = await client.projects.list() as unknown as ProjectEntry[];

      return {
        content: [{
          type: "text" as const,
          text: projects.length === 0
            ? "No projects found."
            : JSON.stringify(projects.map(p => ({
                id: p.project.id,
                name: p.project.name,
                description: p.project.description,
                created_at: p.project.created_at,
                vps_count: p.vps?.length ?? 0,
              })), null, 2),
        }],
      };
    },
  );
}
