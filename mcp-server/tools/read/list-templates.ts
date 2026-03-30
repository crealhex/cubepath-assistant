import { z } from "zod/v4";
import { getCubePathClient } from "../../sdk/client";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerListTemplates(server: McpServer) {
  server.registerTool(
    "list-templates",
    {
      title: "List Available Templates",
      description: "List all available OS templates and application templates for VPS deployment",
      inputSchema: z.object({}),
    },
    async () => {
      const client = getCubePathClient();
      const templates = await client.vps.templates();

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            operating_systems: templates.operating_systems.map((t) => ({
              name: t.template_name,
              os: t.os_name,
              version: t.version,
            })),
            applications: templates.applications.map((a) => ({
              name: a.app_name,
              version: a.version,
              recommended_plan: a.recommended_plan,
              description: a.description,
            })),
          }, null, 2),
        }],
      };
    },
  );
}
