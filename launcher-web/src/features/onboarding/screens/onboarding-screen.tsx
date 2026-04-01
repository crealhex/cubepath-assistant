import { useState, useEffect, useRef } from "react";
import { Button, Input } from "cubepath-ui";
import { KeyRound, Sun, Moon } from "lucide-react";
import { VersionBadge } from "@/features/shared/components/version-badge";
import { api } from "@/core/api-client";

const TITLES = [
  "Let's deploy your next server",
  "Need a VPS in Barcelona?",
  "I'll handle the infrastructure",
  "What are we building today?",
  "Your cloud, one conversation away",
];

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

function Typewriter() {
  const [text, setText] = useState("");
  const [titleIndex, setTitleIndex] = useState(0);
  const phase = useRef<"typing" | "pausing" | "deleting">("typing");
  const charIndex = useRef(0);

  useEffect(() => {
    const title = TITLES[titleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    function tick() {
      if (phase.current === "typing") {
        charIndex.current++;
        setText(title.slice(0, charIndex.current));
        if (charIndex.current === title.length) {
          phase.current = "pausing";
          timeout = setTimeout(tick, 2000);
        } else {
          timeout = setTimeout(tick, 60);
        }
      } else if (phase.current === "pausing") {
        phase.current = "deleting";
        timeout = setTimeout(tick, 30);
      } else {
        charIndex.current--;
        setText(title.slice(0, charIndex.current));
        if (charIndex.current === 0) {
          phase.current = "typing";
          setTitleIndex((i) => (i + 1) % TITLES.length);
        } else {
          timeout = setTimeout(tick, 30);
        }
      }
    }

    timeout = setTimeout(tick, 60);
    return () => clearTimeout(timeout);
  }, [titleIndex]);

  return (
    <>
      {text}
      <span className="inline-block w-[2px] h-[1.2em] bg-foreground align-text-bottom ml-0.5 animate-pulse" />
    </>
  );
}

const SCATTER_PATHS = [
  "M1147 3056 c-125 -73 -232 -137 -237 -142 -6 -6 38 -37 123 -86 72 -42 380 -219 682 -393 303 -174 553 -322 557 -328 4 -7 8 -162 8 -345 0 -184 4 -332 8 -330 4 2 112 63 240 137 l232 134 0 346 0 346 -313 179 c-171 99 -482 278 -689 398 -208 120 -379 218 -380 217 -2 0 -105 -60 -231 -133z",
  "M293 2563 l-292 -168 0 -800 0 -800 197 -112 c108 -62 215 -124 238 -138 l41 -24 6 322 c4 177 7 536 7 797 l0 475 58 32 c105 59 487 281 506 295 18 13 0 25 -218 151 -131 75 -241 137 -245 137 -3 0 -138 -75 -298 -167z",
  "M1103 2122 c-150 -86 -273 -159 -273 -163 0 -3 124 -76 276 -162 l276 -158 141 82 c78 45 202 116 274 158 73 42 133 78 133 81 0 5 -544 320 -551 320 -2 -1 -127 -72 -276 -158z",
  "M1695 1720 l-270 -157 -3 -303 c-1 -167 1 -307 6 -312 4 -4 102 47 217 113 116 67 235 135 265 152 30 17 58 36 62 41 4 6 8 144 8 306 0 162 -4 300 -8 306 -4 7 -100 -43 -277 -146z",
  "M790 1560 l0 -310 23 -14 c56 -35 496 -286 511 -292 15 -6 16 18 14 307 l-3 314 -265 152 c-146 84 -268 153 -272 153 -5 0 -8 -139 -8 -310z",
  "M2505 1213 c-235 -137 -369 -215 -907 -525 l-217 -126 -293 169 c-161 93 -296 169 -300 169 -4 0 -9 -124 -10 -275 l-3 -276 303 -174 304 -174 331 191 c530 306 742 428 899 519 l148 84 0 283 c0 155 -1 282 -2 281 -2 0 -115 -66 -253 -146z",
];

const SCATTER_OFFSETS = [
  { x: 0, y: -800 },
  { x: -600, y: -300 },
  { x: 0, y: -400 },
  { x: 600, y: -200 },
  { x: -600, y: 200 },
  { x: 600, y: 400 },
];

function AssembleScatterLogo() {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 276 319" className="size-24 animate-float">
        <g transform="translate(0,319) scale(0.1,-0.1)" fill="#55E200" stroke="none">
          {SCATTER_PATHS.map((d, i) => (
            <path
              key={i}
              d={d}
              style={{
                opacity: 0,
                animation: `onboard-scatter-${i} 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s forwards`,
              }}
            />
          ))}
        </g>
      </svg>
      <style>{`
        ${SCATTER_OFFSETS.map(
          (offset, i) => `
        @keyframes onboard-scatter-${i} {
          from {
            opacity: 0;
            transform: translate(${offset.x}px, ${offset.y}px) scale(0.6);
          }
          to {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
        }`
        ).join("\n")}
      `}</style>
    </>
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
