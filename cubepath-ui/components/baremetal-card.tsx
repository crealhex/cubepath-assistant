import { cn } from "../lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Cpu, MemoryStick, HardDrive, Network, Gauge, Server } from "lucide-react";

export interface BaremetalModelProps {
  model_name: string;
  cpu: string;
  cpu_specs: string;
  cpu_bench: number;
  ram_size: number;
  ram_type: string;
  disk_size: string;
  disk_type: string;
  port: number;
  kvm: string;
  monthly_price: number;
  stock_available: number;
  onDeploy?: (model: string) => void;
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

function BaremetalCard({
  model_name,
  cpu,
  cpu_specs,
  cpu_bench,
  ram_size,
  ram_type,
  disk_size,
  disk_type,
  port,
  kvm,
  monthly_price,
  stock_available,
  onDeploy,
  className,
}: BaremetalModelProps) {
  const inStock = stock_available > 0;

  return (
    <Card className={cn("w-full max-w-sm", className)}>
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold uppercase font-mono">{model_name}</CardTitle>
        <Badge variant={inStock ? "operational" : "outage"}>
          {inStock ? `${stock_available} in stock` : "Out of stock"}
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-col gap-1.5">
        <SpecRow icon={Cpu} label="CPU" value={cpu} />
        <SpecRow icon={Server} label="Specs" value={cpu_specs} />
        <SpecRow icon={Gauge} label="Score" value={cpu_bench.toLocaleString()} />
        <SpecRow icon={MemoryStick} label="RAM" value={`${ram_size} GB ${ram_type}`} />
        <SpecRow icon={HardDrive} label="Storage" value={`${disk_size} ${disk_type}`} />
        <SpecRow icon={Network} label="Port" value={`${port} Gbps`} />
        {kvm !== "No" && (
          <SpecRow icon={Server} label="KVM" value={kvm} />
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div>
          <span className="text-lg font-bold">${monthly_price.toFixed(2)}</span>
          <span className="text-xs text-muted-foreground"> /mo</span>
        </div>
        {onDeploy && (
          <Button
            size="sm"
            disabled={!inStock}
            onClick={() => onDeploy(model_name)}
          >
            Deploy
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export { BaremetalCard };
