import { useState } from "react";
import { Button, Input } from "cubepath-ui";
import { KeyRound, Sun, Moon } from "lucide-react";
import { VersionBadge } from "@/features/shared/components/version-badge";
import { api } from "@/core/api-client";
import { Typewriter } from "../components/typewriter";
import { AssembleScatterLogo } from "../components/scatter-logo";

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const trimmed = apiKey.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    try {
      await api.updateSettings({ cubepath_api_key: trimmed });
      onComplete();
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex h-screen items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <AssembleScatterLogo />
          <h1 className="h-8 text-2xl font-semibold tracking-tight">
            <Typewriter />
          </h1>
          <p className="text-center text-sm text-muted-foreground leading-relaxed">
            Bring your own API key to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Paste your CubePath API key"
                value={apiKey}
                onChange={(e) => { setApiKey(e.target.value); setError(""); }}
                className="pl-10"
                autoFocus
              />
            </div>
            <p className="text-2xs text-muted-foreground">
              Get yours from the{" "}
              <a
                href="https://my.cubepath.com/api"
                target="_blank"
                rel="noopener"
                className="text-foreground underline underline-offset-2 hover:text-foreground/80"
              >
                CubePath dashboard
              </a>
            </p>
          </div>

          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}

          <Button type="submit" disabled={loading || !apiKey.trim()} className="w-full">
            {loading ? "Connecting..." : "Get started"}
          </Button>
        </form>

        <p className="text-center text-2xs text-muted-foreground/50 leading-relaxed">
          Your key powers both AI and infrastructure.
          <br />
          One key for everything. Stored per session.
        </p>
      </div>
      <ThemeToggle />
      <VersionBadge className="absolute right-4 bottom-4" />
    </div>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("cubepath_theme");
    if (saved) {
      document.documentElement.classList.toggle("dark", saved === "dark");
      return saved === "dark";
    }
    return document.documentElement.classList.contains("dark");
  });
  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute bottom-4 left-4 text-muted-foreground"
      onClick={() => {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem("cubepath_theme", next ? "dark" : "light");
      }}
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
