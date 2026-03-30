import { cn } from "../lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Globe, Shield, Layers, GitBranch, FileCode } from "lucide-react";

export interface CdnPlanProps {
  name: string;
  description: string;
  base_price_per_hour: number;
  price_per_gb: Record<string, number>;
  max_zones: number;
  max_origins_per_zone: number;
  max_rules_per_zone: number;
  custom_ssl_allowed: boolean;
  selected?: boolean;
  onSelect?: (plan: string) => void;
  className?: string;
}

function SpecRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <Icon size={13} className="shrink-0 text-muted-foreground" />
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-auto font-medium">{value}</span>
    </div>
  );
}

function CdnPlanCard({
  name,
  description,
  base_price_per_hour,
  price_per_gb,
  max_zones,
  max_origins_per_zone,
  max_rules_per_zone,
  custom_ssl_allowed,
  selected,
  onSelect,
  className,
}: CdnPlanProps) {
  const monthly = (base_price_per_hour * 730).toFixed(2);
  const avgPerGb = Object.values(price_per_gb)[0];

  return (
    <Card
      className={cn(
        "w-full max-w-xs cursor-pointer transition-all",
        selected ? "border-primary shadow-md" : "hover:border-primary/40",
        className,
      )}
      onClick={() => onSelect?.(name)}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase font-mono">{name}</CardTitle>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div>
          <span className="text-lg font-bold">${monthly}</span>
          <span className="text-xs text-muted-foreground"> /mo</span>
          <span className="text-2xs text-muted-foreground block">${base_price_per_hour}/hr + ${avgPerGb}/GB transfer</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <SpecRow icon={Globe} label="Zones" value={max_zones === -1 ? "Unlimited" : String(max_zones)} />
          <SpecRow icon={GitBranch} label="Origins/zone" value={String(max_origins_per_zone)} />
          <SpecRow icon={FileCode} label="Rules/zone" value={String(max_rules_per_zone)} />
          <SpecRow icon={Shield} label="Custom SSL" value={custom_ssl_allowed ? "Yes" : "No"} />
          <SpecRow icon={Layers} label="Transfer" value={`$${avgPerGb}/GB`} />
        </div>
      </CardContent>

      {onSelect && (
        <CardFooter>
          <Button
            size="sm"
            variant={selected ? "default" : "outline"}
            className="w-full"
            onClick={(e) => { e.stopPropagation(); onSelect(name); }}
          >
            {selected ? "Selected" : "Select"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export { CdnPlanCard };
