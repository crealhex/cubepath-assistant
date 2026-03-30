import { z } from "zod/v4";
import { getCubePathClient } from "../../sdk/client";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerDeployVps(server: McpServer) {
  server.registerTool(
    "deploy-vps",
    {
      title: "Deploy VPS",
      description: "Deploy a new VPS instance using the CubePath SDK directly (simple mode, no Terraform state tracking)",
      inputSchema: z.object({
        projectId: z.string().describe("The project ID to deploy into"),
        name: z.string().describe("Hostname for the VPS instance"),
        label: z.string().describe("Display label for the VPS instance"),
        plan: z.string().describe("Plan name (e.g. 'gp.nano', 'gp.small')"),
        template: z.string().describe("Template name (e.g. 'ubuntu-24', 'debian-12')"),
        location: z.string().describe("Location name (e.g. 'eu-barcelona', 'us-mia-1')"),
        sshKeyNames: z.array(z.string()).optional().describe("SSH key names to add"),
        password: z.string().optional().describe("Root password (required if no SSH keys provided)"),
      }),
    },
    async ({ projectId, name, label, plan, template, location, sshKeyNames, password }) => {
      const client = getCubePathClient();
      const task = await client.vps.create(projectId, {
        name,
        label,
        plan_name: plan,
        template_name: template,
        location_name: location,
        ssh_key_names: sshKeyNames,
        password,
      });

      return {
        content: [{
          type: "text" as const,
          text: `VPS deployment initiated.\n\n${JSON.stringify(task, null, 2)}\n\nThe instance is being provisioned. Use list-instances to check when it's ready.`,
        }],
      };
    },
  );
}
