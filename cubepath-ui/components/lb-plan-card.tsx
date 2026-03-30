import { cn } from "../lib/utils";
import { Button } from "./button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Server, Radio, Zap } from "lucide-react";

export interface LbPlanProps {
  name: string;
  description: string;
  price_per_hour: number;
  max_targets: number;
  max_listeners: number;
  connections_per_second: number;
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

function LbPlanCard({
  name,
  description,
  price_per_hour,
  max_targets,
  max_listeners,
  connections_per_second,
  selected,
  onSelect,
  className,
}: LbPlanProps) {
  const monthly = (price_per_hour * 730).toFixed(2);

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
          <span className="text-2xs text-muted-foreground block">${price_per_hour}/hr</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <SpecRow icon={Server} label="Targets" value={String(max_targets)} />
          <SpecRow icon={Radio} label="Listeners" value={String(max_listeners)} />
          <SpecRow icon={Zap} label="Conn/sec" value={connections_per_second.toLocaleString()} />
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

export { LbPlanCard };
