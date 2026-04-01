/** Maps raw tool output to component-ready props, per component type */
import { getTemplateIcon } from "@/assets/icons";

type Mapper = (data: unknown) => Array<Record<string, unknown>>;

const mappers: Record<string, Mapper> = {
  "location-picker": (data) => {
    const locations = data as Array<Record<string, unknown>>;
    const pingable = new Set(["bcn", "mia", "hou"]);
    const enriched = locations.map((loc) => ({
      ...loc,
      skipPing: !pingable.has((loc.code as string).toLowerCase()),
    }));
    return [{ locations: enriched, pingUrl: "https://{code}.ping.cubepath.com/ping" }];
  },

  "template-picker": (data) => {
    const result = data as { operating_systems: Array<Record<string, unknown>>; applications: Array<Record<string, unknown>> };
    const templates = [
      ...result.operating_systems.map((t) => ({
        name: t.template_name,
        os: t.os_name,
        version: t.version,
        description: t.description,
        icon: getTemplateIcon(t.template_name as string),
      })),
      ...result.applications.map((a) => ({
        name: a.template_name,
        os: a.app_name,
        version: a.version,
        description: a.description,
        recommended_plan: a.recommended_plan,
        icon: getTemplateIcon(a.template_name as string) ?? getTemplateIcon(a.app_name as string),
      })),
    ];
    return [{ templates, title: "1-click apps & operating systems" }];
  },

  "project-card": (data) => {
    const projects = data as Array<Record<string, unknown>>;
    return projects.map((p) => ({
      name: p.name,
      description: p.description,
      vpsCount: p.vps_count,
    }));
  },

  "instance-card": (data) => {
    const statusMap: Record<string, string> = { active: "running" };
    const instances = data as Array<Record<string, unknown>>;
    return instances.map((v) => {
      const raw = v.status as string;
      return {
        id: v.id,
        name: v.name,
        status: statusMap[raw] ?? raw,
        project: v.project,
        ip: v.ip,
        plan: v.plan,
        location: v.location,
        template: v.template,
      };
    });
  },

  "pricing-table": (data) => {
    const locations = data as Array<{ clusters: Array<{ plans: Array<Record<string, unknown>> }> }>;
    const plans = locations.flatMap((loc) =>
      loc.clusters.flatMap((c) =>
        c.plans.map((p) => ({
          plan: p.plan_name,
          vcpu: p.cpu,
          ram_gb: (p.ram as number) / 1024,
          storage_gb: p.storage,
          bandwidth_tb: p.bandwidth,
          price_monthly: Math.round(Number(p.price_per_hour) * 730 * 100) / 100,
          price_hourly: Number(p.price_per_hour),
        })),
      ),
    );
    return [{ plans }];
  },
};

/** Transform raw tool data for a component. Returns raw data if no mapper exists. */
export function mapToolResult(component: string, data: unknown): Array<Record<string, unknown>> {
  const mapper = mappers[component];
  if (mapper) return mapper(data);
  return Array.isArray(data) ? data as Array<Record<string, unknown>> : [data as Record<string, unknown>];
}
