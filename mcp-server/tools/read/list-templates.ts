import { z } from "zod/v4";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getCubePathClient } from "../../sdk/client";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const pricing = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "../../data/pricing.json"), "utf-8"),
);

const pricingOsMap = new Map<string, Record<string, unknown>>(
  (pricing.vps?.templates ?? []).map((t: Record<string, unknown>) => [t.template_name, t]),
);

const pricingAppMap = new Map<string, Record<string, unknown>>(
  (pricing.vps?.apps ?? []).map((a: Record<string, unknown>) => [
    (a.app_name as string).toLowerCase(),
    a,
  ]),
);

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

      const operating_systems = templates.operating_systems.map((t) => {
        const enriched = pricingOsMap.get(t.template_name);
        return {
          template_name: t.template_name,
          os_name: t.os_name,
          version: t.version,
          description: (enriched?.description as string) ?? null,
          operating_system: (enriched?.operating_system as string) ?? null,
        };
      });

      const applications = templates.applications.map((a) => {
        const enriched = pricingAppMap.get(a.app_name.toLowerCase());
        return {
          template_name: (enriched?.template_name as string) ?? a.app_name.toLowerCase(),
          app_name: a.app_name,
          version: a.version,
          recommended_plan: a.recommended_plan,
          description: a.description,
          app_docs: (enriched?.app_docs as string) ?? null,
          app_wiki: (enriched?.app_wiki as string) ?? null,
          license_type: (enriched?.license_type as string) ?? null,
          app_port: (enriched?.app_port as number) ?? null,
        };
      });

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({ operating_systems, applications }, null, 2),
        }],
      };
    },
  );
}
