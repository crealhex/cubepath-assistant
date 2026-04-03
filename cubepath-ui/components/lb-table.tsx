import { cn } from "../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { ShowMoreButton } from "./show-more-button";
import { useTableExpand } from "../hooks/use-table-expand";

export interface LbRow {
  name: string;
  description: string;
  price_per_hour: number;
  max_targets: number;
  max_listeners: number;
  connections_per_second: number;
}

export interface LbTableProps {
  title?: string;
  plans: LbRow[];
  selected?: string;
  onSelect?: (plan: string) => void;
  initialRows?: number;
  className?: string;
}

function LbTable({
  title = "Load Balancer Plans",
  plans,
  selected,
  onSelect,
  initialRows = 5,
  className,
}: LbTableProps) {
  const { visible, expanded, needsExpand, remaining, toggle } = useTableExpand(plans, initialRows);

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
                <th className="px-3 py-2 text-right font-medium text-muted-foreground">Targets</th>
                <th className="px-3 py-2 text-right font-medium text-muted-foreground">Listeners</th>
                <th className="px-3 py-2 text-right font-medium text-muted-foreground">Conn/sec</th>
                <th className="px-4 py-2 text-right font-medium text-muted-foreground">Price</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => {
                const isSel = p.name === selected;
                const monthly = (p.price_per_hour * 730).toFixed(2);
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
                    <td className="px-3 py-2.5 text-right">{p.max_targets}</td>
                    <td className="px-3 py-2.5 text-right">{p.max_listeners}</td>
                    <td className="px-3 py-2.5 text-right">{p.connections_per_second.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-right font-medium whitespace-nowrap">
                      ${monthly}<span className="text-muted-foreground font-normal">/mo</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {needsExpand && (
          <ShowMoreButton expanded={expanded} remaining={remaining} onClick={toggle} />
        )}
      </CardContent>
    </Card>
  );
}

export { LbTable };
