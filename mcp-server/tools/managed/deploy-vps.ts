import { z } from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { generateVpsResource } from "../../terraform/generator";
import { terraformInit, terraformPlan, terraformApply } from "../../terraform/runner";
import { getProjectDir } from "../../terraform/runner";

export function registerManagedDeployVps(server: McpServer) {
  server.registerTool(
    "managed-deploy-vps",
    {
      title: "Deploy VPS (Managed)",
      description: "Deploy a new VPS instance via Terraform. Generates HCL, runs plan and apply. State is tracked in .tfstate for drift detection and collaboration.",
      inputSchema: z.object({
        projectId: z.string().describe("The launcher project ID (used as Terraform workspace)"),
        cubepathProjectId: z.string().describe("The CubePath project ID to deploy into"),
        name: z.string().describe("Name for the VPS instance"),
        plan: z.string().describe("Plan name (e.g. 'vps-2cpu-4gb')"),
        template: z.string().describe("Template name (e.g. 'ubuntu-24.04')"),
        location: z.string().describe("Location name (e.g. 'eu-barcelona')"),
        sshKeyNames: z.array(z.string()).optional().describe("SSH key names to add"),
      }),
    },
    async ({ projectId, cubepathProjectId, name, plan, template, location, sshKeyNames }) => {
      const resourceName = name.replace(/[^a-zA-Z0-9_]/g, "_");

      // Generate .tf file
      const tfPath = generateVpsResource(projectId, resourceName, {
        name,
        plan,
        template,
        location,
        projectId: cubepathProjectId,
        sshKeyNames,
      });

      const dir = getProjectDir(projectId);

      // Init
      const init = await terraformInit(dir);
      if (init.exitCode !== 0) {
        return {
          content: [{ type: "text" as const, text: `Terraform init failed:\n${init.stderr}` }],
        };
      }

      // Plan
      const planResult = await terraformPlan(dir);
      if (planResult.exitCode !== 0) {
        return {
          content: [{ type: "text" as const, text: `Terraform plan failed:\n${planResult.stderr}` }],
        };
      }

      // Apply
      const apply = await terraformApply(dir);
      if (apply.exitCode !== 0) {
        return {
          content: [{ type: "text" as const, text: `Terraform apply failed:\n${apply.stderr}` }],
        };
      }

      return {
        content: [{
          type: "text" as const,
          text: `VPS "${name}" deployed via Terraform.\n\nGenerated: ${tfPath}\nPlan:\n${planResult.stdout}\n\nApply:\n${apply.stdout}`,
        }],
      };
    },
  );
}
