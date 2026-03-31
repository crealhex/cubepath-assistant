import { z } from "zod/v4";
import { getCubePathClient } from "cubepath-tools";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

interface SshKeysResponse {
  sshkeys: Array<{
    id: number;
    name: string;
    ssh_key: string;
    fingerprint: string;
    key_type: string;
    created_at: string;
  }>;
}

export function registerListSshKeys(server: McpServer) {
  server.registerTool(
    "list-ssh-keys",
    {
      title: "List SSH Keys",
      description: "List all SSH keys stored in the CubePath account",
      inputSchema: z.object({}),
    },
    async () => {
      const client = getCubePathClient();
      const response = await client.sshKeys.list() as unknown as SshKeysResponse;
      const keys = response.sshkeys;

      return {
        content: [{
          type: "text" as const,
          text: keys.length === 0
            ? "No SSH keys found."
            : JSON.stringify(keys, null, 2),
        }],
      };
    },
  );
}
