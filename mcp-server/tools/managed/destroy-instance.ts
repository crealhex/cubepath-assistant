import { z } from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { removeResource } from "../../terraform/generator";
import { terraformApply, getProjectDir } from "../../terraform/runner";

export function registerManagedDestroyInstance(server: McpServer) {
  server.registerTool(
    "managed-destroy-instance",
    {
      title: "Destroy Instance (Managed)",
      description: "Destroy a VPS instance via Terraform. Removes the .tf resource file and applies, ensuring state consistency.",
      inputSchema: z.object({
        projectId: z.string().describe("The launcher project ID (Terraform workspace)"),
        resourceName: z.string().describe("The Terraform resource name (used as filename, e.g. 'web_server_01')"),
      }),
    },
    async ({ projectId, resourceName }) => {
      removeResource(projectId, resourceName);

      const dir = getProjectDir(projectId);
      const apply = await terraformApply(dir);

      if (apply.exitCode !== 0) {
        return {
          content: [{ type: "text" as const, text: `Terraform apply failed:\n${apply.stderr}` }],
        };
      }

      return {
        content: [{
          type: "text" as const,
          text: `Resource "${resourceName}" removed and Terraform applied.\n\n${apply.stdout}`,
        }],
      };
    },
  );
}
