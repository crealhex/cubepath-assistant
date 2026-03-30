import { z } from "zod/v4";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { terraformShow, getProjectDir } from "../../terraform/runner";

export function registerManagedShowState(server: McpServer) {
  server.registerTool(
    "managed-show-state",
    {
      title: "Show Terraform State",
      description: "Show the current Terraform state for a managed project, including all tracked resources and their attributes.",
      inputSchema: z.object({
        projectId: z.string().describe("The launcher project ID (Terraform workspace)"),
      }),
    },
    async ({ projectId }) => {
      const dir = getProjectDir(projectId);
      const result = await terraformShow(dir);

      if (result.exitCode !== 0) {
        return {
          content: [{ type: "text" as const, text: `Terraform show failed:\n${result.stderr}` }],
        };
      }

      return {
        content: [{ type: "text" as const, text: result.stdout }],
      };
    },
  );
}
