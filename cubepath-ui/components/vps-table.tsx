import * as React from "react";
import { cn } from "../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { SegmentedControl } from "./segmented-control";
import { ShowMoreButton } from "./show-more-button";
import { useTableExpand } from "../hooks/use-table-expand";

export interface PlanRow {
  plan: string;
  vcpu: number;
  ram_gb: number;
  storage_gb: number;
  bandwidth_tb: number;
  price_monthly: number;
  price_hourly: number;
  cluster?: string;
}

export interface VpsTableProps {
  title?: string;
  plans: PlanRow[];
  recommended?: string;
  selected?: string;
  onSelect?: (plan: string) => void;
  initialRows?: number;
  className?: string;
}

function PlanRows({ plans, recommended, selected, onSelect }: { plans: PlanRow[]; recommended?: string; selected?: string; onSelect?: (plan: string) => void }) {
  return (
    <>
      {plans.map((p) => {
        const isRec = p.plan === recommended;
        const isSel = p.plan === selected;
        return (
          <tr
            key={p.plan}
            onClick={() => onSelect?.(p.plan)}
            className={cn(
              "border-b border-border last:border-0 transition-colors",
              onSelect && "cursor-pointer hover:bg-primary/10",
              isSel && "bg-primary/5",
            )}
          >
            <td className="px-4 py-2.5 font-mono font-medium">
              <span className="flex items-center gap-2">
                {p.plan}
                {isRec && <Badge variant="brand" className="text-2xs px-1.5 py-0">rec</Badge>}
              </span>
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
    </>
  );
}

function TableHead() {
  return (
    <thead>
      <tr className="border-b border-border bg-muted/50">
        <th className="px-4 py-2 text-left font-medium text-muted-foreground">Plan</th>
        <th className="px-3 py-2 text-right font-medium text-muted-foreground">vCPU</th>
        <th className="px-3 py-2 text-right font-medium text-muted-foreground">RAM</th>
        <th className="px-3 py-2 text-right font-medium text-muted-foreground">Storage</th>
        <th className="px-4 py-2 text-right font-medium text-muted-foreground">Price</th>
      </tr>
    </thead>
  );
}

/** Tabbed pricing table — one tab per cluster */
function VpsTable({
  title = "Available Plans",
  plans,
  recommended,
  selected,
  onSelect,
  initialRows = 5,
  className,
}: VpsTableProps) {
  const [expandedTabs, setExpandedTabs] = React.useState<Set<string>>(new Set());

  const clusters = React.useMemo(() => {
    const map = new Map<string, PlanRow[]>();
    for (const p of plans) {
      const key = p.cluster ?? "All";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    }
    return map;
  }, [plans]);

  const clusterNames = [...clusters.keys()];
  const hasClusters = clusterNames.length > 1;
  const [activeCluster, setActiveCluster] = React.useState(clusterNames[0] ?? "All");

  const expanded = expandedTabs.has(activeCluster);
  const allPlans = hasClusters ? (clusters.get(activeCluster) ?? []) : plans;
  const needsExpand = allPlans.length > initialRows;
  const visiblePlans = expanded || !needsExpand ? allPlans : allPlans.slice(0, initialRows);

  return (
    <Card className={cn("w-full overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        {hasClusters && (
          <div className="pt-2">
            <SegmentedControl
              value={activeCluster}
              onValueChange={setActiveCluster}
              options={clusterNames.map((c) => ({ value: c, label: c }))}
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-xs">
          <TableHead />
          <tbody>
            <PlanRows plans={visiblePlans} recommended={recommended} selected={selected} onSelect={onSelect} />
          </tbody>
        </table>
        {needsExpand && (
          <ShowMoreButton expanded={expanded} remaining={allPlans.length - initialRows} onClick={() => {
            const next = new Set(expandedTabs);
            expanded ? next.delete(activeCluster) : next.add(activeCluster);
            setExpandedTabs(next);
          }} />
        )}
      </CardContent>
    </Card>
  );
}

export { VpsTable };
