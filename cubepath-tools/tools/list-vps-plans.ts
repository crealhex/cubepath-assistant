import { z } from "zod/v4";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ReadTool } from "../types";

const VpsPlan = z.object({
  plan_name: z.string(),
  ram: z.number(),
  cpu: z.number(),
  storage: z.number(),
  bandwidth: z.number(),
  price_per_hour: z.string(),
  status: z.number(),
});

const Cluster = z.object({
  cluster_name: z.string(),
  type: z.string(),
  plans: z.array(VpsPlan),
});

const VpsLocation = z.object({
  location_name: z.string(),
  description: z.string(),
  clusters: z.array(Cluster),
});

const pricing = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "../data/pricing.json"), "utf-8"),
);
const vpsLocations = z.array(VpsLocation).parse(pricing.vps?.locations ?? []);

export const listVpsPlans: ReadTool = {
  name: "list-vps-plans",
  kind: "read",
  description: "List available VPS plans with specs and pricing, grouped by location and cluster. Use when the user asks about pricing, plans, or costs.",
  schema: z.object({
    location: z.string().describe("Location name to filter by (e.g. 'eu-bcn-1'). Required — call list-locations first to see available locations."),
  }),
  async execute(args) {
    const location = args.location as string;
    const filtered = vpsLocations.filter((l) => l.location_name === location);
    if (filtered.length === 0) return JSON.stringify([]);
    return JSON.stringify(filtered, null, 2);
  },
};
