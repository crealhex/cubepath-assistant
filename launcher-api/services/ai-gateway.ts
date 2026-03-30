import type { AiGateway, ChatChunk, Message, AiProvider, ComponentBlock } from "../types";

// --- Mock Strategy ---

function createMockGateway(): AiGateway {
  const responses: Record<string, string> = {
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
    cost: `Here's your estimated monthly cost breakdown:

| Resource | Plan | Cost |
|----------|------|------|
| web-server-01 | vps-4cpu-8gb | $19.99/mo |
| api-gateway | vps-2cpu-4gb | $9.99/mo |
| db-primary | c1.metal.standard | $249.00/mo |
| monitoring | vps-2cpu-4gb | $9.99/mo |

**Total:** $288.97/mo`,
    code: `Here's how to interact with CubePath's API:

**Python** — using the official SDK:

\`\`\`python
import cubepath

client = cubepath.Client(api_key="cp_live_...")
instance = client.vps.create(
    name="web-server-03",
    region="eu-frankfurt",
    plan="vps-4cpu-8gb",
)
print(f"Deployed {instance.name} at {instance.ip_address}")
\`\`\`

**Go** — using the REST API:

\`\`\`go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	payload, _ := json.Marshal(map[string]string{
		"name":   "web-server-03",
		"region": "eu-frankfurt",
		"plan":   "vps-4cpu-8gb",
	})
	req, _ := http.NewRequest("POST", "https://api.cubepath.com/v1/vps", bytes.NewBuffer(payload))
	req.Header.Set("Authorization", "Bearer cp_live_...")
	resp, _ := http.DefaultClient.Do(req)
	defer resp.Body.Close()
	fmt.Printf("Status: %s\\n", resp.Status)
}
\`\`\``,
  };

  responses.math2 = `Here's a quick overview of key formulas used in infrastructure capacity planning:

**Network throughput** for $n$ servers with bandwidth $B$:

$$T_{total} = \\sum_{i=1}^{n} B_i \\cdot \\eta_i$$

where $\\eta_i$ is the efficiency factor for server $i$ (typically $0.85 \\leq \\eta \\leq 0.95$).

**IOPS estimation** for NVMe storage:

$$\\text{IOPS}_{effective} = \\frac{\\text{IOPS}_{raw}}{1 + \\frac{W}{R} \\cdot (A_f - 1)}$$

where $W/R$ is the write-to-read ratio and $A_f$ is the write amplification factor.

**Uptime SLA** expressed as nines:

$$\\text{Downtime}_{annual} = 365.25 \\times 24 \\times 60 \\times (1 - \\frac{SLA}{100}) \\text{ minutes}$$

For **99.99%** SLA: $\\Delta t = 365.25 \\times 24 \\times 60 \\times 0.0001 \\approx 52.6$ minutes/year.

**Auto-scaling threshold** using exponential moving average:

$$\\text{EMA}_t = \\alpha \\cdot x_t + (1 - \\alpha) \\cdot \\text{EMA}_{t-1}$$

Scale up when $\\text{EMA}_t > \\theta_{up}$, scale down when $\\text{EMA}_t < \\theta_{down}$.`;

  interface MockResponse {
    text: string;
    components?: ComponentBlock[];
  }

  function getResponse(input: string): MockResponse {
    const lower = input.toLowerCase();

    if (lower.includes("price") || lower.includes("plan") || lower.includes("cost")) {
      return {
        text: "Here are the **General Purpose** VPS plans:",
        components: [
          { component: "pricing-table", props: { plans: [
            { plan: "gp.nano", vcpu: 1, ram_gb: 2, storage_gb: 40, bandwidth_tb: 3, price_monthly: 4.06, price_hourly: 0.00556 },
            { plan: "gp.micro", vcpu: 2, ram_gb: 4, storage_gb: 80, bandwidth_tb: 5, price_monthly: 8.11, price_hourly: 0.01111 },
            { plan: "gp.starter", vcpu: 4, ram_gb: 8, storage_gb: 100, bandwidth_tb: 10, price_monthly: 15.21, price_hourly: 0.02083 },
            { plan: "gp.small", vcpu: 8, ram_gb: 16, storage_gb: 200, bandwidth_tb: 20, price_monthly: 29.40, price_hourly: 0.04028 },
          ], recommended: "gp.starter" } },
        ],
      };
    }

    if (lower.includes("deploy") || lower.includes("create") || lower.includes("new")) {
      return {
        text: "Deploying your new VPS instance...",
        components: [
          { component: "deploy-progress", props: { name: "hackathon-test", plan: "gp.nano", location: "eu-bcn-1", currentStep: "provisioning" } },
        ],
      };
    }

    if (lower.includes("instance") || lower.includes("server")) {
      return {
        text: "Here are your instances in **first-project**:",
        components: [
          { component: "instance-card", props: { id: 23706, name: "web-server", status: "running", project: "first-project", ip: "194.26.100.42", plan: { plan_name: "gp.nano", cpu: 1, ram: 2048, storage: 40, bandwidth: 3, price_per_hour: "0.00556" }, location: "Barcelona, Spain", template: "Ubuntu 24" } },
          { component: "instance-card", props: { id: 23707, name: "api-gateway", status: "running", project: "first-project", ip: "157.254.174.88", plan: { plan_name: "gp.starter", cpu: 4, ram: 8192, storage: 100, bandwidth: 10, price_per_hour: "0.02290" }, location: "Miami, FL", template: "Debian 12" } },
          { component: "instance-card", props: { id: 23708, name: "db-primary", status: "stopped", project: "first-project", ip: "108.165.47.12", plan: { plan_name: "gp.small", cpu: 8, ram: 16384, storage: 200, bandwidth: 20, price_per_hour: "0.04230" }, location: "Houston, TX", template: "Ubuntu 24" } },
        ],
      };
    }

    if (lower.includes("project")) {
      return {
        text: "Here are your projects:",
        components: [
          { component: "project-card", props: { id: 3065, name: "first-project", description: "Default project", vpsCount: 3 } },
          { component: "project-card", props: { id: 3066, name: "staging", description: "Staging environment", vpsCount: 0 } },
        ],
      };
    }

    if (lower.includes("error") || lower.includes("fail")) {
      return {
        text: "Something went wrong while processing your request:",
        components: [
          { component: "error-card", props: { title: "Deployment failed", message: "Location 'eu-barcelona' does not exist.", suggestion: "Try using 'eu-bcn-1' instead." } },
        ],
      };
    }

    // Default — text only
    return {
      text: responses.default,
    };
  }

  return {
    async *stream(messages: Message[]): AsyncIterable<ChatChunk> {
      const last = messages[messages.length - 1]?.content ?? "";
      const { text, components } = getResponse(last);
      const words = text.split(/(\s+)/);

      await Bun.sleep(300);
      for (const word of words) {
        yield { type: "text", content: word };
        await Bun.sleep(20 + Math.random() * 30);
      }

      // Yield components after text is done streaming
      if (components) {
        await Bun.sleep(200);
        for (const block of components) {
          yield { type: "component", block };
          await Bun.sleep(150);
        }
      }

      yield { type: "done" };
    },
  };
}

// --- OpenAI Strategy ---

function createOpenAiGateway(apiKey: string, model: string, baseUrl?: string): AiGateway {
  const url = `${baseUrl || "https://api.openai.com/v1"}/chat/completions`;

  return {
    async *stream(messages: Message[], tools?: unknown[]): AsyncIterable<ChatChunk> {
      const body: Record<string, unknown> = {
        model,
        stream: true,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      };
      if (tools && tools.length > 0) {
        body.tools = tools;
      }

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.text();
        yield { type: "text", content: `Error from AI provider: ${res.status} ${err}` };
        yield { type: "done" };
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        yield { type: "done" };
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          const data = trimmed.slice(6);
          if (data === "[DONE]") {
            yield { type: "done" };
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              yield { type: "text", content: delta };
            }
          } catch {
            // skip malformed chunks
          }
        }
      }

      yield { type: "done" };
    },
  };
}

// --- Claude CLI Strategy (Beta) ---

function createClaudeCliGateway(binaryPath?: string): AiGateway {
  const bin = binaryPath || "claude";

  return {
    async *stream(messages: Message[]): AsyncIterable<ChatChunk> {
      const last = messages[messages.length - 1]?.content ?? "";

      const proc = Bun.spawn([bin, "-p", last, "--output-format", "stream-json"], {
        stdout: "pipe",
        stderr: "pipe",
      });

      const reader = proc.stdout.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          try {
            const parsed = JSON.parse(trimmed);
            if (parsed.type === "content" && parsed.content) {
              yield { type: "text", content: parsed.content };
            }
          } catch {
            // Non-JSON output, yield as text
            if (trimmed) {
              yield { type: "text", content: trimmed };
            }
          }
        }
      }

      yield { type: "done" };
    },
  };
}

// --- Resolver ---

export function resolveGateway(
  provider: AiProvider,
  settings: Record<string, string>,
): AiGateway {
  switch (provider) {
    case "openai":
      return createOpenAiGateway(
        settings.openai_api_key,
        settings.ai_model || "gpt-4o",
        settings.openai_base_url,
      );
    case "claude-cli":
      return createClaudeCliGateway(settings.claude_cli_path);
    case "mock":
    default:
      return createMockGateway();
  }
}
