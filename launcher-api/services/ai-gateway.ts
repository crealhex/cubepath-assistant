import type { AiGateway, ChatChunk, Message, AiProvider } from "../types";

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

  function getResponse(input: string): string {
    const lower = input.toLowerCase();
    if (lower.includes("deploy") || lower.includes("create") || lower.includes("new")) return responses.deploy;
    if (lower.includes("status") || lower.includes("show") || lower.includes("list")) return responses.status;
    if (lower.includes("cost") || lower.includes("price") || lower.includes("bill")) return responses.cost;
    if (lower.includes("math2")) return responses.math2;
    if (lower.includes("math")) return responses.cost;
    if (lower.includes("code") || lower.includes("script") || lower.includes("sdk") || lower.includes("example")) return responses.code;
    return responses.default;
  }

  return {
    async *stream(messages: Message[]): AsyncIterable<ChatChunk> {
      const last = messages[messages.length - 1]?.content ?? "";
      const response = getResponse(last);
      const words = response.split(/(\s+)/);

      await Bun.sleep(300);
      for (const word of words) {
        yield { type: "text", content: word };
        await Bun.sleep(20 + Math.random() * 30);
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
