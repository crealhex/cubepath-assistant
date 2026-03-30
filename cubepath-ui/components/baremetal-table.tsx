import { cn } from "../lib/utils";
import { Badge } from "./badge";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

export interface BaremetalRow {
  model_name: string;
  cpu: string;
  cpu_specs: string;
  cpu_bench: number;
  ram_size: number;
  ram_type: string;
  disk_size: string;
  disk_type: string;
  port: number;
  monthly_price: number;
  stock_available: number;
}

export interface BaremetalTableProps {
  title?: string;
  models: BaremetalRow[];
  selected?: string;
  onSelect?: (model: string) => void;
  className?: string;
}

function BaremetalTable({
  title = "Baremetal Servers",
  models,
  selected,
  onSelect,
  className,
}: BaremetalTableProps) {
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
                <th className="px-4 py-2 text-left font-medium text-muted-foreground">Model</th>
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">CPU</th>
                <th className="px-3 py-2 text-right font-medium text-muted-foreground">RAM</th>
                <th className="px-3 py-2 text-right font-medium text-muted-foreground">Storage</th>
                <th className="px-3 py-2 text-right font-medium text-muted-foreground">Port</th>
                <th className="px-3 py-2 text-right font-medium text-muted-foreground">Score</th>
                <th className="px-3 py-2 text-right font-medium text-muted-foreground">Stock</th>
                <th className="px-4 py-2 text-right font-medium text-muted-foreground">Price</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m) => {
                const isSel = m.model_name === selected;
                const inStock = m.stock_available > 0;
                return (
                  <tr
                    key={m.model_name}
                    onClick={() => inStock && onSelect?.(m.model_name)}
                    className={cn(
                      "border-b border-border last:border-0 transition-colors",
                      inStock && onSelect && "cursor-pointer hover:bg-primary/10",
                      !inStock && "opacity-50",
                      isSel && "bg-primary/5",
                    )}
                  >
                    <td className="px-4 py-2.5 font-mono font-medium whitespace-nowrap">{m.model_name}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <div>{m.cpu}</div>
                      <div className="text-2xs text-muted-foreground">{m.cpu_specs}</div>
                    </td>
                    <td className="px-3 py-2.5 text-right whitespace-nowrap">{m.ram_size} GB {m.ram_type}</td>
                    <td className="px-3 py-2.5 text-right whitespace-nowrap">{m.disk_size} {m.disk_type}</td>
                    <td className="px-3 py-2.5 text-right">{m.port} Gbps</td>
                    <td className="px-3 py-2.5 text-right font-mono">{m.cpu_bench.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right">
                      <Badge variant={inStock ? "operational" : "outage"} className="text-2xs">
                        {inStock ? m.stock_available : "0"}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium whitespace-nowrap">
                      ${m.monthly_price.toFixed(2)}<span className="text-muted-foreground font-normal">/mo</span>
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

export { BaremetalTable };
