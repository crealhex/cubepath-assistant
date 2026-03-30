import * as React from "react";
import { cn } from "../lib/utils";

export interface LocationOption {
  location_name: string;
  code: string;
  city: string;
  country: string;
  region: string;
  services: string[];
  test_ipv4?: string;
  latency?: number | null;
}

export interface LocationPickerProps {
  locations: LocationOption[];
  selected?: string;
  onSelect?: (locationName: string) => void;
  filter?: string[];
  className?: string;
}

const countryToCode: Record<string, string> = {
  Spain: "es",
  Netherlands: "nl",
  "United States": "us",
};

const regions = ["All Regions", "Europe", "North America"] as const;

function LocationPicker({
  locations,
  selected,
  onSelect,
  filter,
  className,
}: LocationPickerProps) {
  const [activeRegion, setActiveRegion] = React.useState<string>("All Regions");

  const filtered = filter
    ? locations.filter((l) => l.services.some((s) => filter.includes(s)))
    : locations;

  const visible =
    activeRegion === "All Regions"
      ? filtered
      : filtered.filter((l) => l.region === activeRegion);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Region filter tabs */}
      <div className="flex justify-center gap-2">
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

      {/* Location grid */}
      <div className="grid grid-cols-3 gap-3">
        {visible.map((loc) => {
          const isSelected = selected === loc.location_name;
          const flagCode = countryToCode[loc.country] ?? "xx";

          return (
            <button
              key={loc.location_name}
              type="button"
              onClick={() => onSelect?.(loc.location_name)}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all",
                "shadow-sm hover:border-primary/40 hover:shadow-md",
                isSelected
                  ? "border-primary shadow-md"
                  : "border-border/60",
              )}
            >
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
                  {loc.country}
                </span>
              </div>
              {loc.latency != null ? (
                <span
                  className={cn(
                    "shrink-0 flex items-center gap-1.5 text-2xs font-mono tabular-nums",
                    loc.latency < 100 && "text-status-operational",
                    loc.latency >= 100 && loc.latency < 200 && "text-status-degraded",
                    loc.latency >= 200 && "text-status-outage",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-1.5 w-1.5 rounded-full",
                      loc.latency < 100 && "bg-status-operational",
                      loc.latency >= 100 && loc.latency < 200 && "bg-status-degraded",
                      loc.latency >= 200 && "bg-status-outage",
                    )}
                  />
                  {loc.latency}ms
                </span>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={14}
                  height={14}
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors"
                >
                  <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { LocationPicker };
