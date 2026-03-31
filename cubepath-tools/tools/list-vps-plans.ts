import { z } from "zod/v4";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Tool } from "../types";

const pricing = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "../data/pricing.json"), "utf-8"),
);
const vpsLocations = pricing.vps?.locations ?? [];

export const listVpsPlans: Tool = {
  name: "list-vps-plans",
  description: "List available VPS plans with specs and pricing, grouped by location and cluster. Use when the user asks about pricing, plans, or costs.",
  schema: z.object({
    location: z.string().describe("Location name to filter by (e.g. 'eu-bcn-1'). Required — call list-locations first to see available locations."),
  }),
  async execute(args) {
    const location = args.location as string;
    const filtered = vpsLocations.filter((l: Record<string, unknown>) => l.location_name === location);
    if (filtered.length === 0) return JSON.stringify([]);
    return JSON.stringify(filtered, null, 2);
  },
};
