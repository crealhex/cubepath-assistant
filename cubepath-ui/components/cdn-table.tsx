import { cn } from "../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

export interface CdnRow {
  name: string;
  description: string;
  base_price_per_hour: number;
  price_per_gb: Record<string, number>;
  max_zones: number;
  max_origins_per_zone: number;
  max_rules_per_zone: number;
  custom_ssl_allowed: boolean;
}

export interface CdnTableProps {
  title?: string;
  plans: CdnRow[];
  selected?: string;
  onSelect?: (plan: string) => void;
  className?: string;
}

function CdnTable({
  title = "CDN Plans",
  plans,
  selected,
  onSelect,
  className,
}: CdnTableProps) {
  return (
    <Card className={cn("w-full overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-2 text-left font-medium text-muted-foreground">Plan</th>
                <th className="px-3 py-2 text-right font-medium text-muted-foreground">Zones</th>
                <th className="px-3 py-2 text-right font-medium text-muted-foreground">Origins</th>
                <th className="px-3 py-2 text-right font-medium text-muted-foreground">Rules</th>
                <th className="px-3 py-2 text-right font-medium text-muted-foreground">Transfer</th>
                <th className="px-3 py-2 text-right font-medium text-muted-foreground">SSL</th>
                <th className="px-4 py-2 text-right font-medium text-muted-foreground">Price</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => {
                const isSel = p.name === selected;
                const monthly = (p.base_price_per_hour * 730).toFixed(2);
                const avgGb = Object.values(p.price_per_gb)[0];
                return (
                  <tr
                    key={p.name}
                    onClick={() => onSelect?.(p.name)}
                    className={cn(
                      "border-b border-border last:border-0 transition-colors",
                      onSelect && "cursor-pointer hover:bg-primary/10",
                      isSel && "bg-primary/5",
                    )}
                  >
                    <td className="px-4 py-2.5 font-mono font-medium whitespace-nowrap">
                      <div>{p.name}</div>
                      <div className="text-2xs text-muted-foreground font-sans font-normal">{p.description}</div>
                    </td>
                    <td className="px-3 py-2.5 text-right">{p.max_zones === -1 ? "∞" : p.max_zones}</td>
                    <td className="px-3 py-2.5 text-right">{p.max_origins_per_zone}/zone</td>
                    <td className="px-3 py-2.5 text-right">{p.max_rules_per_zone}/zone</td>
                    <td className="px-3 py-2.5 text-right">${avgGb}/GB</td>
                    <td className="px-3 py-2.5 text-right">{p.custom_ssl_allowed ? "✓" : "—"}</td>
                    <td className="px-4 py-2.5 text-right font-medium whitespace-nowrap">
                      ${monthly}<span className="text-muted-foreground font-normal">/mo</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export { CdnTable };
