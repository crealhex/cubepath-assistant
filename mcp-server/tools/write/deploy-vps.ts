import { z } from "zod/v4";
import { getCubePathClient } from "cubepath-tools";
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
        label: z.string().describe("Space-separated tags for the VPS instance (e.g. 'production web-app')"),
        plan: z.string().describe("Plan name (e.g. 'gp.nano', 'gp.small')"),
        template: z.string().describe("Template name (e.g. 'ubuntu-24', 'debian-12')"),
        location: z.string().describe("Location name (e.g. 'eu-bcn-1', 'us-mia-1')"),
        sshKeyNames: z.array(z.string()).optional().describe("SSH key names to add for passwordless access"),
        password: z.string().optional().describe("Root password (required if no SSH keys provided). Must be 8+ chars with at least one uppercase and one lowercase letter"),
        user: z.string().optional().describe("Custom username instead of root (may not work with password auth — use SSH keys for custom users)"),
        networkId: z.string().optional().describe("Private network ID to attach"),
        ipv4: z.boolean().optional().describe("Request a public IPv4 address"),
        enableBackups: z.boolean().optional().describe("Enable automatic backups"),
        customCloudInit: z.string().optional().describe("Cloud-init script for first-boot automation"),
      }),
    },
    async ({ projectId, name, label, plan, template, location, sshKeyNames, password, user, ipv4, enableBackups, customCloudInit }) => {
      const client = getCubePathClient();
      const task = await client.vps.create(projectId, {
        name,
        label,
        plan_name: plan,
        template_name: template,
        location_name: location,
        ssh_key_names: sshKeyNames,
        password,
        user,
        ipv4,
        enable_backups: enableBackups,
        custom_cloud_init: customCloudInit,
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
