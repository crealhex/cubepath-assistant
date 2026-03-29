import type { McpClient, ChatChunk, Resource } from "./mcp-client";

const MOCK_RESOURCES: Resource[] = [
  {
    id: "vps-001",
    type: "VPS",
    name: "web-server-01",
    status: "operational",
    region: "Frankfurt, DE",
    meta: { cpu: "4 vCPU", ram: "8 GB", disk: "100 GB NVMe", ip: "185.92.0.12" },
  },
  {
    id: "vps-002",
    type: "VPS",
    name: "api-gateway",
    status: "operational",
    region: "Barcelona, ES",
    meta: { cpu: "2 vCPU", ram: "4 GB", disk: "50 GB NVMe", ip: "185.92.0.34" },
  },
  {
    id: "bare-001",
    type: "Dedicated",
    name: "db-primary",
    status: "maintenance",
    region: "Houston, TX",
    meta: { cpu: "AMD Ryzen 9 7900", ram: "128 GB DDR5", disk: "2x 2TB NVME", ip: "185.92.1.10" },
  },
  {
    id: "vps-003",
    type: "VPS",
    name: "monitoring",
    status: "degraded",
    region: "Miami, FL",
    meta: { cpu: "2 vCPU", ram: "4 GB", disk: "25 GB SSD", ip: "185.92.0.56" },
  },
];

const MOCK_RESPONSES: Record<string, string> = {
  default: `I can help you manage your CubePath infrastructure. Here's what I can do:

- **Deploy** new VPS instances or dedicated servers
- **Monitor** existing resources and their status
- **Scale** resources up or down
- **Manage** DNS, firewall rules, and networking

What would you like to do?`,
  deploy: `I'll create a new VPS instance with the following specs:

**Region:** Frankfurt, DE
**CPU:** 4 vCPU
**RAM:** 8 GB
**Disk:** 100 GB NVMe

\`\`\`hcl
resource "cubepath_vps" "new_instance" {
  name   = "web-server-02"
  region = "eu-frankfurt"
  plan   = "vps-4cpu-8gb"
}
\`\`\`

Deploying now... This will take about 30 seconds.`,
  status: `Here's the current status of your infrastructure:

- **web-server-01** (Frankfurt) — Operational, 99.9% uptime
- **api-gateway** (Barcelona) — Operational
- **db-primary** (Houston) — Maintenance window, ETA 15 min
- **monitoring** (Miami) — Degraded, high latency detected

Would you like me to investigate the degraded monitoring instance?`,
};

function getResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("deploy") || lower.includes("create") || lower.includes("new")) {
    return MOCK_RESPONSES.deploy;
  }
  if (lower.includes("status") || lower.includes("show") || lower.includes("list")) {
    return MOCK_RESPONSES.status;
  }
  return MOCK_RESPONSES.default;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createMockClient(): McpClient {
  return {
    async *sendMessage(content: string): AsyncIterable<ChatChunk> {
      const response = getResponse(content);
      const words = response.split(/(\s+)/);

      await delay(300);

      for (const word of words) {
        yield { type: "text", content: word };
        await delay(20 + Math.random() * 30);
      }

      yield { type: "done" };
    },

    async getResources(): Promise<Resource[]> {
      await delay(500);
      return MOCK_RESOURCES;
    },

    isConnected(): boolean {
      return true;
    },
  };
}
