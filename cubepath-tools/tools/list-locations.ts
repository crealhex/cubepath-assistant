import { z } from "zod/v4";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Tool } from "../types";

const locations = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "../data/locations.json"), "utf-8"),
);

export const listLocations: Tool = {
  name: "list-locations",
  description: "List all available CubePath datacenter locations with city, country, region, supported services (vps, baremetal, network), and test IPs. Use when the user asks about regions, datacenters, or where they can deploy.",
  schema: z.object({}),
  async execute() {
    return JSON.stringify(locations, null, 2);
  },
};
