import { z } from "zod/v4";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ReadTool } from "../types";

const CdnPlan = z.object({
  uuid: z.string(),
  name: z.string(),
  description: z.string(),
  price_per_gb: z.record(z.string(), z.number()),
  base_price_per_hour: z.number(),
  max_zones: z.number(),
  max_origins_per_zone: z.number(),
  max_rules_per_zone: z.number(),
  custom_ssl_allowed: z.boolean(),
});

const pricing = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "../data/pricing.json"), "utf-8"),
);
const cdnPlans = z.array(CdnPlan).parse(pricing.cdn?.plans ?? []);

export const listCdnPlans: ReadTool = {
  name: "list-cdn-plans",
  kind: "read",
  description: "List available CDN plans with pricing, zones, origins, and rules limits.",
  schema: z.object({}),
  async execute() {
    if (cdnPlans.length === 0) return JSON.stringify([]);
    return JSON.stringify(cdnPlans, null, 2);
  },
};
