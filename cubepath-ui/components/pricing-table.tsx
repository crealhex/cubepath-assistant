import * as React from "react";
import { cn } from "../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";

export interface PlanRow {
  plan: string;
  vcpu: number;
  ram_gb: number;
  storage_gb: number;
  bandwidth_tb: number;
  price_monthly: number;
  price_hourly: number;
}

export interface PricingTableProps {
  title?: string;
  plans: PlanRow[];
  recommended?: string;
  selected?: string;
  onSelect?: (plan: string) => void;
  className?: string;
}

function PricingTable({
  title = "Available Plans",
  plans,
  recommended,
  selected,
  onSelect,
  className,
}: PricingTableProps) {
  return (
    <Card className={cn("w-full max-w-lg overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-2 text-left font-medium text-muted-foreground">Plan</th>
                <th className="px-3 py-2 text-right font-medium text-muted-foreground">vCPU</th>
                <th className="px-3 py-2 text-right font-medium text-muted-foreground">RAM</th>
                <th className="px-3 py-2 text-right font-medium text-muted-foreground">Storage</th>
                <th className="px-4 py-2 text-right font-medium text-muted-foreground">Price</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => {
                const isRec = p.plan === recommended;
                const isSel = p.plan === selected;
                return (
                  <tr
                    key={p.plan}
                    onClick={() => onSelect?.(p.plan)}
                    className={cn(
                      "border-b border-border last:border-0 transition-colors",
                      onSelect && "cursor-pointer hover:bg-brand/5",
                      isSel && "bg-brand/10",
                    )}
                  >
                    <td className="px-4 py-2.5 font-mono font-medium flex items-center gap-2">
                      {p.plan}
                      {isRec && <Badge variant="brand" className="text-[10px] px-1.5 py-0">rec</Badge>}
                    </td>
                    <td className="px-3 py-2.5 text-right">{p.vcpu}</td>
                    <td className="px-3 py-2.5 text-right">{p.ram_gb} GB</td>
                    <td className="px-3 py-2.5 text-right">{p.storage_gb} GB</td>
                    <td className="px-4 py-2.5 text-right font-medium">
                      ${p.price_monthly.toFixed(2)}<span className="text-muted-foreground font-normal">/mo</span>
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

export { PricingTable };
