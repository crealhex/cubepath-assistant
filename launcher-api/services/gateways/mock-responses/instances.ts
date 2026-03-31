import type { MockResponse } from "./types";

export const match = (s: string) => /instance|server/.test(s);

export const response: MockResponse = {
  text: `Let me check what's running in your **first-project**. Pulling up all your instances now...

{{begin:instance-card}}
{{instance-card:0}}
{{instance-card:1}}
{{instance-card:2}}
{{end:instance-card}}

Looks like **db-primary** is currently stopped. Your other two instances are running smoothly. Want me to start the database server back up, or is there anything else you'd like to do?`,
  componentData: {
    "instance-card:0": { component: "instance-card", props: { id: 23706, name: "web-server", status: "running", project: "first-project", ip: "194.26.100.42", plan: { plan_name: "gp.nano", cpu: 1, ram: 2048, storage: 40, bandwidth: 3, price_per_hour: "0.00556" }, location: "Barcelona, Spain", template: "Ubuntu 24" } },
    "instance-card:1": { component: "instance-card", props: { id: 23707, name: "api-gateway", status: "running", project: "first-project", ip: "157.254.174.88", plan: { plan_name: "gp.starter", cpu: 4, ram: 8192, storage: 100, bandwidth: 10, price_per_hour: "0.02290" }, location: "Miami, FL", template: "Debian 12" } },
    "instance-card:2": { component: "instance-card", props: { id: 23708, name: "db-primary", status: "stopped", project: "first-project", ip: "108.165.47.12", plan: { plan_name: "gp.small", cpu: 8, ram: 16384, storage: 200, bandwidth: 20, price_per_hour: "0.04230" }, location: "Houston, TX", template: "Ubuntu 24" } },
  },
};
