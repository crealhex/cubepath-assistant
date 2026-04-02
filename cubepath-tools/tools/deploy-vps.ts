import { z } from "zod/v4";
import { getCubePathClient } from "../sdk";
import type { AuthWriteTool } from "../types";

export const deployVps: AuthWriteTool = {
  name: "deploy-vps",
  kind: "auth-write",
  description: "Deploy a new VPS instance on CubePath. Returns deployment status with VPS ID and IP addresses. Show a deployment summary with plan, location, template, and estimated cost, and get explicit user approval before calling this tool.",
  schema: z.object({
    projectId: z.string().describe("The project ID to deploy into"),
    name: z.string().describe("Hostname for the VPS instance"),
    label: z.string().describe("Space-separated tags for the VPS instance (e.g. 'production web-app')"),
    plan: z.string().describe("Plan name (e.g. 'gp.nano', 'gp.small')"),
    template: z.string().describe("Template name (e.g. 'ubuntu-24', 'debian-12')"),
    location: z.string().describe("Location name (e.g. 'eu-bcn-1', 'us-mia-1')"),
    sshKeyNames: z.array(z.string()).optional().describe("SSH key names to add for passwordless access"),
    password: z.string().optional().describe("Root password (required if no SSH keys provided). Must be 8+ chars with at least one uppercase and one lowercase letter"),
    user: z.string().optional().describe("Custom username instead of root (may not work with password auth — use SSH keys for custom users)"),
    ipv4: z.boolean().optional().describe("Request a public IPv4 address"),
    enableBackups: z.boolean().optional().describe("Enable automatic backups"),
    customCloudInit: z.string().optional().describe("Cloud-init script for first-boot automation"),
  }),
  async execute(args, context) {
    const client = getCubePathClient(context.apiKey);
    const task = await client.vps.create(args.projectId as string, {
      name: args.name as string,
      label: args.label as string,
      plan_name: args.plan as string,
      template_name: args.template as string,
      location_name: args.location as string,
      ssh_key_names: args.sshKeyNames as string[] | undefined,
      password: args.password as string | undefined,
      user: args.user as string | undefined,
      ipv4: args.ipv4 as boolean | undefined,
      enable_backups: args.enableBackups as boolean | undefined,
      custom_cloud_init: args.customCloudInit as string | undefined,
    });

    return JSON.stringify(task, null, 2);
  },
};
