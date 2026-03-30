import { z } from "zod/v4";
import { getCubePathClient } from "../../sdk/client";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerListInstances(server: McpServer) {
  server.registerTool(
    "list-instances",
    {
      title: "List All Instances",
      description: "List all VPS instances and baremetal servers across all projects",
      inputSchema: z.object({}),
    },
    async () => {
      const client = getCubePathClient();
      const projects = await client.vps.list() as unknown as Array<{
        project: { id: number; name: string };
        vps: Array<{
          id: number; name: string; status: string; ipv4: string;
          plan: { plan_name: string }; location: { location_name: string }; template: { template_name: string };
        }>;
      }>;

      const instances = projects.flatMap((p) => {
        return p.vps.map((v) => ({
          id: v.id,
          name: v.name,
          status: v.status,
          project: p.project.name,
          ip: v.ipv4,
          plan: v.plan.plan_name,
          location: v.location.location_name,
          template: v.template.template_name,
        }));
      });

      return {
        content: [{
          type: "text" as const,
          text: instances.length === 0
            ? "No instances found."
            : JSON.stringify(instances, null, 2),
        }],
      };
    },
  );
}
