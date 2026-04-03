import type { MockResponse } from "./types";

export const match = (s: string) => /price|plan|cost/.test(s);

export const response: MockResponse = {
  text: `Sure! Let me grab the latest pricing for you. Here's a breakdown of the **General Purpose** VPS plans — these are the most popular ones and cover most use cases from hobby projects to production workloads.

{{vps-table:0}}

The **gp.starter** is our most recommended plan — great balance of performance and price. All plans include DDoS protection, NVMe storage, and IPv6. Need help picking the right one for your workload?`,
  componentData: {
    "vps-table:0": { component: "vps-table", props: { plans: [
      { plan: "gp.nano", vcpu: 1, ram_gb: 2, storage_gb: 40, bandwidth_tb: 3, price_monthly: 4.06, price_hourly: 0.00556 },
      { plan: "gp.micro", vcpu: 2, ram_gb: 4, storage_gb: 80, bandwidth_tb: 5, price_monthly: 8.11, price_hourly: 0.01111 },
      { plan: "gp.starter", vcpu: 4, ram_gb: 8, storage_gb: 100, bandwidth_tb: 10, price_monthly: 15.21, price_hourly: 0.02083 },
      { plan: "gp.small", vcpu: 8, ram_gb: 16, storage_gb: 200, bandwidth_tb: 20, price_monthly: 29.40, price_hourly: 0.04028 },
    ], recommended: "gp.starter" } },
  },
};
