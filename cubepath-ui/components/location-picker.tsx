import { cn } from "../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

export interface LocationOption {
  location_name: string;
  code: string;
  city: string;
  country: string;
  region: string;
  services: string[];
}

export interface LocationPickerProps {
  locations: LocationOption[];
  selected?: string;
  onSelect?: (locationName: string) => void;
  filter?: string[];
  className?: string;
}

const flagEmoji: Record<string, string> = {
  Spain: "\uD83C\uDDEA\uD83C\uDDF8",
  Netherlands: "\uD83C\uDDF3\uD83C\uDDF1",
  "United States": "\uD83C\uDDFA\uD83C\uDDF8",
};

function LocationPicker({
  locations,
  selected,
  onSelect,
  filter,
  className,
}: LocationPickerProps) {
  const filtered = filter
    ? locations.filter((l) => l.services.some((s) => filter.includes(s)))
    : locations;

  const grouped = filtered.reduce<Record<string, LocationOption[]>>((acc, loc) => {
    (acc[loc.region] ??= []).push(loc);
    return acc;
  }, {});

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Select a region</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {Object.entries(grouped).map(([region, locs]) => (
          <div key={region} className="flex flex-col gap-1.5">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {region}
            </span>
            <div className="flex flex-wrap gap-2">
              {locs.map((loc) => (
                <button
                  key={loc.location_name}
                  type="button"
                  onClick={() => onSelect?.(loc.location_name)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-all",
                    "hover:border-brand/50 hover:bg-brand/5",
                    selected === loc.location_name
                      ? "border-brand bg-brand/10 text-brand font-medium"
                      : "border-border text-foreground",
                  )}
                >
                  <span className="text-base leading-none">
                    {flagEmoji[loc.country] ?? "\uD83C\uDF10"}
                  </span>
                  <div className="flex flex-col items-start gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <span>{loc.city}</span>
                      <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1 rounded">
                        {loc.code}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {loc.country}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export { LocationPicker };
