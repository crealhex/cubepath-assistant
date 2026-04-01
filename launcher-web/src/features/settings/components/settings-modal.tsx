import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "cubepath-ui";
import { api, API_BASE_URL_V1 } from "@/core/api-client";

function getUserId(): string {
  return localStorage.getItem("cubepath_user_id") ?? "";
}

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      api.getSettings().then((s) => {
        setApiKey(s.cubepath_api_key ?? "");
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
        body: JSON.stringify({ cubepath_api_key: apiKey.trim() }),
      });
      setSaved(true);
      setTimeout(() => onClose(), 800);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

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
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
            <p className="text-xs text-muted-foreground">
              Get it from the{" "}
              <a href="https://my.cubepath.com/api" target="_blank" rel="noopener" className="underline">
                CubePath dashboard
              </a>
            </p>
          </div>
          <Button onClick={handleSave} disabled={loading || !apiKey.trim()}>
            {saved ? "Saved!" : loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
