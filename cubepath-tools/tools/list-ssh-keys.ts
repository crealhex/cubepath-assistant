import { z } from "zod/v4";
import { getCubePathClient } from "../sdk";
import type { AuthReadTool } from "../types";

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

export const listSshKeys: AuthReadTool = {
  name: "list-ssh-keys",
  kind: "auth-read",
  description: "List all SSH keys in the user's CubePath account. Use when the user asks about their keys or during deploy setup.",
  schema: z.object({}),
  async execute(_args, context) {
    const client = getCubePathClient(context.apiKey);
    const response = await client.sshKeys.list() as unknown as SshKeysResponse;
    const keys = response.sshkeys;

    if (keys.length === 0) return JSON.stringify([]);
    return JSON.stringify(keys.map((k) => ({
      id: k.id,
      name: k.name,
      fingerprint: k.fingerprint,
      key_type: k.key_type,
      created_at: k.created_at,
    })), null, 2);
  },
};
