export interface VpsPlan {
  plan_name: string;
  cpu: number;
  ram: number;
  storage: number;
  bandwidth: number;
  price_per_hour: string;
}

export interface VpsInstance {
  id: number;
  name: string;
  status: string;
  ipv4: string;
  ipv6: string;
  plan: VpsPlan;
  location: { location_name: string; description: string };
  template: { template_name: string; os_name: string };
  created_at: string;
}

export interface ProjectEntry {
  project: { id: number; name: string; description: string; created_at: string };
  networks: unknown[];
  baremetals: unknown[];
  vps: VpsInstance[];
}
