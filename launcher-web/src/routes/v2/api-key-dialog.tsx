import { useState } from "react";
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from "cubepath-ui";
import { API_BASE_URL_V1 } from "@/services/api-client";

function getUserId(): string {
  return localStorage.getItem("cubepath_user_id") ?? "";
}

export function ApiKeyDialog({ onSaved }: { onSaved: () => void }) {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!key.trim()) return;
    setLoading(true);
    setError("");

    try {
      await fetch(`${API_BASE_URL_V1}/api/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": getUserId(),
        },
        body: JSON.stringify({ cubepath_api_key: key.trim() }),
      });
      onSaved();
    } catch {
      setError("Failed to save. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-lg">Bring your CubePath API Key</CardTitle>
          <p className="text-xs text-muted-foreground">
            Your key powers both infrastructure management and AI. One key for everything.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            type="password"
            placeholder="Paste your CubePath API key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
          {error && <p className="text-xs text-status-outage">{error}</p>}
          <Button onClick={handleSave} disabled={loading || !key.trim()}>
            {loading ? "Saving..." : "Get Started"}
          </Button>
          <p className="text-2xs text-muted-foreground text-center">
            Get your key from the <a href="https://my.cubepath.com/settings/api" target="_blank" rel="noopener" className="underline">CubePath dashboard</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
