import * as React from "react";
import { cn } from "../lib/utils";
import { Badge } from "./badge";

export interface LocationOption {
  location_name: string;
  code: string;
  city: string;
  country: string;
  region: string;
  services: string[];
  tier?: string;
  latency?: number | null;
  skipPing?: boolean;
}

export interface LocationPickerProps {
  locations: LocationOption[];
  selected?: string;
  onSelect?: (locationName: string) => void;
  filter?: string[];
  pingUrl?: string;
  pingInterval?: number;
  className?: string;
}

const countryToCode: Record<string, string> = {
  Spain: "es",
  Netherlands: "nl",
  "United States": "us",
};

const regions = ["All Regions", "Europe", "North America"] as const;

const serviceBadgeVariant: Record<string, "operational" | "brand" | "secondary"> = {
  vps: "operational",
  baremetal: "brand",
  network: "secondary",
};

async function measureBurstPing(url: string, count = 5): Promise<number> {
  const times: number[] = [];
  const ts = Date.now();
  for (let i = 0; i < count; i++) {
    const start = performance.now();
    try {
      await fetch(`${url}?_=${ts}-${i}`, {
        cache: "no-cache",
        signal: AbortSignal.timeout(3000),
      });
      times.push(Math.round(performance.now() - start));
    } catch {
      // skip failed pings
    }
  }
  if (times.length === 0) return -1;
  times.sort((a, b) => a - b);
  return times[Math.floor(times.length / 2)]!;
}

function useInternalPing(
  locations: LocationOption[],
  pingUrl?: string,
  intervalMs = 8000,
): Record<string, number> {
  const [latencies, setLatencies] = React.useState<Record<string, number>>({});
  const locRef = React.useRef(locations);
  locRef.current = locations;

  React.useEffect(() => {
    if (!pingUrl) return;

    let active = true;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    async function ping() {
      if (document.hidden) return;
      const results = await Promise.all(
        locRef.current.map(async (loc) => {
          let ms: number;
          if (loc.skipPing) {
            ms = -1;
          } else {
            const url = pingUrl!.replace("{code}", loc.code.toLowerCase());
            ms = await measureBurstPing(url);
          }
          return [loc.location_name, ms] as const;
        }),
      );
      if (active) {
        setLatencies(Object.fromEntries(results.filter(([, ms]) => ms >= 0)));
      }
    }

    function handleVisibility() {
      if (document.hidden) {
        clearInterval(intervalId);
      } else {
        ping();
        intervalId = setInterval(ping, intervalMs);
      }
    }

    ping();
    intervalId = setInterval(ping, intervalMs);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      active = false;
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [pingUrl, intervalMs]);

  return latencies;
}

function LatencyBadge({ ms }: { ms: number }) {
  return (
    <span
      className={cn(
        "shrink-0 flex items-center gap-1.5 text-2xs font-mono tabular-nums",
        ms < 100 && "text-status-operational",
        ms >= 100 && ms < 200 && "text-status-degraded",
        ms >= 200 && "text-status-outage",
      )}
    >
      <span
        className={cn(
          "inline-block h-1.5 w-1.5 rounded-full",
          ms < 100 && "bg-status-operational",
          ms >= 100 && ms < 200 && "bg-status-degraded",
          ms >= 200 && "bg-status-outage",
        )}
      />
      {ms}ms
    </span>
  );
}

function LocationPicker({
  locations,
  selected,
  onSelect,
  filter,
  pingUrl,
  pingInterval,
  className,
}: LocationPickerProps) {
  const [activeRegion, setActiveRegion] = React.useState<string>("All Regions");
  const internalLatencies = useInternalPing(locations, pingUrl, pingInterval);

  const filtered = filter
    ? locations.filter((l) => l.services.some((s) => filter.includes(s)))
    : locations;

  const visible =
    activeRegion === "All Regions"
      ? filtered
      : filtered.filter((l) => l.region === activeRegion);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap justify-center gap-2">
        {regions.map((region) => (
          <button
            key={region}
            type="button"
            onClick={() => setActiveRegion(region)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeRegion === region
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            {region}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visible.map((loc) => {
          const isSelected = selected === loc.location_name;
          const flagCode = countryToCode[loc.country] ?? "xx";
          const latency = loc.latency ?? internalLatencies[loc.location_name] ?? null;

          return (
            <button
              key={loc.location_name}
              type="button"
              onClick={() => onSelect?.(loc.location_name)}
              className={cn(
                "group relative flex flex-col gap-2 rounded-lg border px-4 py-3 text-left transition-all",
                "shadow-sm hover:border-primary/40 hover:shadow-md",
                isSelected
                  ? "border-primary shadow-md"
                  : "border-border/60",
              )}
            >
              <div className="flex items-center gap-3">
                <img
                  src={`https://hatscripts.github.io/circle-flags/flags/${flagCode}.svg`}
                  width={18}
                  height={18}
                  alt=""
                  className="shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold leading-tight">{loc.city}</span>
                  <span className="block text-xs text-muted-foreground leading-tight">
                    {loc.country}{loc.tier ? ` · Tier ${loc.tier}` : ""}
                  </span>
                </div>
                {latency != null && <LatencyBadge ms={latency} />}
              </div>

              <div className="flex flex-wrap gap-1">
                {loc.services.map((s) => (
                  <Badge
                    key={s}
                    variant={serviceBadgeVariant[s] ?? "secondary"}
                    className="text-2xs px-1.5 py-0"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { LocationPicker };
