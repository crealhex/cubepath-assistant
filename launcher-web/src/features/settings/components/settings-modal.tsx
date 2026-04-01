import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  SegmentedControl,
} from "cubepath-ui";
import { api, API_BASE_URL_V1 } from "@/core/api-client";
import allModels from "../models.json";

function getUserId(): string {
  return localStorage.getItem("cubepath_user_id") ?? "";
}

interface ModelEntry {
  id: string;
  owned_by: string;
  pricing: { input_per_million_tokens: string; output_per_million_tokens: string };
  capabilities: { tools: boolean };
}

const models = (allModels as ModelEntry[]).filter((m) => m.capabilities.tools);

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [tier, setTier] = useState<"safe" | "write" | "destructive">("safe");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      api.getSettings().then((s) => {
        setApiKey(s.cubepath_api_key ?? "");
        setModel(s.ai_model ?? "deepseek/deepseek-chat");
        setTier((s.permission_tier as "safe" | "write" | "destructive") ?? "safe");
        setSaved(false);
      });
    }
  }, [open]);

  async function handleSave() {
    setLoading(true);
    try {
      await fetch(`${API_BASE_URL_V1}/api/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": getUserId(),
        },
        body: JSON.stringify({
          ...(apiKey.trim() && { cubepath_api_key: apiKey.trim() }),
          ai_model: model,
          permission_tier: tier,
        }),
      });
      setSaved(true);
      setTimeout(() => onClose(), 800);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  // Group models by provider
  const grouped = models.reduce<Record<string, ModelEntry[]>>((acc, m) => {
    const provider = m.owned_by;
    if (!acc[provider]) acc[provider] = [];
    acc[provider].push(m);
    return acc;
  }, {});

  const providerOrder = ["deepseek", "openai", "anthropic", "google", "xai"];
  const sortedProviders = providerOrder.filter((p) => grouped[p]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Your CubePath API key powers both infrastructure and AI. One key for everything.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">CubePath API Key</label>
            <Input
              type="password"
              placeholder="Paste your API key"
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); setSaved(false); }}
            />
            <p className="text-xs text-muted-foreground">
              Get it from the{" "}
              <a href="https://my.cubepath.com/api" target="_blank" rel="noopener" className="underline">
                CubePath dashboard
              </a>
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">AI Model</label>
            <select
              value={model}
              onChange={(e) => { setModel(e.target.value); setSaved(false); }}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
            >
              {sortedProviders.map((provider) => (
                <optgroup key={provider} label={provider.charAt(0).toUpperCase() + provider.slice(1)}>
                  {grouped[provider].map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.id.split("/")[1]} — ${parseFloat(m.pricing.input_per_million_tokens)}/${parseFloat(m.pricing.output_per_million_tokens)}/M
                    </option>
                  ))}
                </optgroup>
              ))}
              {models.length === 0 && (
                <option value={model}>{model}</option>
              )}
            </select>
            <p className="text-xs text-muted-foreground">
              All models support tool calling. Prices shown as input/output per million tokens.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Permission Level</label>
            <SegmentedControl
              value={tier}
              onValueChange={(v) => { setTier(v as "safe" | "write" | "destructive"); setSaved(false); }}
              options={[
                { value: "safe", label: "Safe" },
                { value: "write", label: "Write" },
                { value: "destructive", label: "Full" },
              ]}
            />
            <p className="text-xs text-muted-foreground">
              {tier === "safe" && "Read-only — browse resources, check status, view plans."}
              {tier === "write" && "Create resources — deploy VPS, add SSH keys. Requires approval."}
              {tier === "destructive" && "Full access — includes destroy, delete, and resize operations."}
            </p>
          </div>

          <Button onClick={handleSave} disabled={loading}>
            {saved ? "Saved!" : loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
