import { z } from "zod/v4";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getCubePathClient } from "../../sdk/client";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const PricingOs = z.object({
  template_name: z.string(),
  os_name: z.string(),
  description: z.string(),
  operating_system: z.string(),
  version: z.string(),
});

const PricingApp = z.object({
  template_name: z.string(),
  app_name: z.string(),
  version: z.string(),
  recommended_plan: z.string(),
  description: z.string(),
  app_docs: z.string(),
  app_wiki: z.string(),
  license_type: z.string(),
  app_port: z.number(),
  app_password_auto_generated: z.number(),
  environments: z.array(z.unknown()),
});

const pricing = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "../../data/pricing.json"), "utf-8"),
);

const pricingOsList = z.array(PricingOs).parse(pricing.vps?.templates ?? []);
const pricingAppList = z.array(PricingApp).parse(pricing.vps?.apps ?? []);

const pricingOsMap = new Map(pricingOsList.map((t) => [t.template_name, t]));
const pricingAppMap = new Map(pricingAppList.map((a) => [a.app_name.toLowerCase(), a]));

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
          description: enriched?.description ?? null,
          operating_system: enriched?.operating_system ?? null,
        };
      });

      const applications = templates.applications.map((a) => {
        const enriched = pricingAppMap.get(a.app_name.toLowerCase());
        return {
          template_name: enriched?.template_name ?? a.app_name.toLowerCase(),
          app_name: a.app_name,
          version: a.version,
          recommended_plan: a.recommended_plan,
          description: a.description,
          app_docs: enriched?.app_docs ?? null,
          app_wiki: enriched?.app_wiki ?? null,
          license_type: enriched?.license_type ?? null,
          app_port: enriched?.app_port ?? null,
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
