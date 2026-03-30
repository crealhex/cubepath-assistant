import { z } from "zod/v4";
import { getCubePathClient } from "../../sdk/client";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ProjectEntry } from "../../types/api";

export function registerGetStatus(server: McpServer) {
  server.registerTool(
    "get-instance-status",
    {
      title: "Get Instance Status",
      description: "Get detailed status and information about a specific VPS instance",
      inputSchema: z.object({
        instanceId: z.string().describe("The VPS instance ID"),
      }),
    },
    async ({ instanceId }) => {
      const client = getCubePathClient();
      const projects = await client.vps.list() as unknown as ProjectEntry[];

      const numId = Number(instanceId);
      for (const p of projects) {
        const vps = p.vps.find((v) => v.id === numId);
        if (vps) {
          return {
            content: [{
              type: "text" as const,
              text: JSON.stringify({
                id: vps.id,
                name: vps.name,
                status: vps.status,
                project: p.project.name,
                ip: vps.ipv4,
                ipv6: vps.ipv6,
                plan: vps.plan,
                location: vps.location,
                template: vps.template,
                created: vps.created_at,
              }, null, 2),
            }],
          };
        }
      }

      return {
        content: [{
          type: "text" as const,
          text: `VPS instance ${instanceId} not found.`,
        }],
        isError: true,
      };
    },
  );
}
