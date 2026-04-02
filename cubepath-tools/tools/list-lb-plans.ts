import { z } from "zod/v4";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ReadTool } from "../types";

const LbPlan = z.object({
  uuid: z.string(),
  name: z.string(),
  description: z.string(),
  price_per_hour: z.number(),
  max_targets: z.number(),
  max_listeners: z.number(),
  connections_per_second: z.number(),
});

const Location = z.object({
  location_name: z.string(),
  location_description: z.string(),
  plans: z.array(LbPlan),
});

const pricing = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "../data/pricing.json"), "utf-8"),
);
const lbLocations = z.array(Location).parse(pricing.loadbalancer?.locations ?? []);

export const listLbPlans: ReadTool = {
  name: "list-lb-plans",
  kind: "read",
  description: "List available load balancer plans with pricing, grouped by location.",
  schema: z.object({
    location: z.string().optional().describe("Filter by location name (e.g. 'eu-bcn-1')"),
  }),
  async execute(args) {
    const location = args.location as string | undefined;
    const filtered = location
      ? lbLocations.filter((l) => l.location_name === location)
      : lbLocations;

    if (filtered.length === 0) return JSON.stringify([]);
    return JSON.stringify(filtered, null, 2);
  },
};
