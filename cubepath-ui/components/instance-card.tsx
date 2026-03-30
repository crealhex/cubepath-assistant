import { cn } from "../lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Globe,
  Network,
  MapPin,
  Monitor,
  DollarSign,
  Shield,
} from "lucide-react";

type InstanceStatus =
  | "running"
  | "deploying"
  | "stopped"
  | "stopping"
  | "error"
  | "destroying";

const statusConfig: Record<
  InstanceStatus,
  { label: string; variant: "operational" | "degraded" | "outage" | "maintenance"; pulse?: boolean }
> = {
  running: { label: "Running", variant: "operational" },
  deploying: { label: "Deploying", variant: "maintenance", pulse: true },
  stopped: { label: "Stopped", variant: "outage" },
  stopping: { label: "Stopping", variant: "degraded", pulse: true },
  error: { label: "Error", variant: "outage" },
  destroying: { label: "Destroying", variant: "degraded", pulse: true },
};

export interface InstancePlan {
  plan_name: string;
  cpu: number;
  ram: number;
  storage: number;
  bandwidth: number;
  price_per_hour?: string;
}

export interface InstanceCardProps {
  id: number;
  name: string;
  status: InstanceStatus;
  project?: string;
  ip?: string;
  plan?: string | InstancePlan;
  location?: string;
  template?: string;
  onPowerAction?: (instanceId: number, action: string) => void;
  onDestroy?: (instanceId: number) => void;
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

function InstanceCard({
  id,
  name,
  status,
  project,
  ip,
  plan,
  location,
  template,
  onPowerAction,
  onDestroy,
  className,
}: InstanceCardProps) {
  const config = statusConfig[status] ?? statusConfig.error;
  const isTransient = status === "deploying" || status === "stopping" || status === "destroying";
  const richPlan = typeof plan === "object" ? plan : null;
  const planName = typeof plan === "string" ? plan : richPlan?.plan_name;

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 pb-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <CardTitle className="text-sm font-semibold truncate">{name}</CardTitle>
          {planName && (
            <span className="text-2xs font-mono text-muted-foreground uppercase">{planName}</span>
          )}
        </div>
        <Badge variant={config.variant} className={cn(config.pulse && "animate-pulse")}>
          {config.label}
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {richPlan && (
          <div className="flex flex-col gap-1.5 pb-2 border-b border-border">
            <SpecRow icon={Cpu} label="vCPU" value={`${richPlan.cpu}`} />
            <SpecRow icon={MemoryStick} label="RAM" value={`${richPlan.ram >= 1024 ? `${richPlan.ram / 1024} GB` : `${richPlan.ram} MB`}`} />
            <SpecRow icon={HardDrive} label="Storage" value={`${richPlan.storage} GB NVMe`} />
            <SpecRow icon={Globe} label="Bandwidth" value={`${richPlan.bandwidth} TB`} />
            {richPlan.price_per_hour && (
              <SpecRow icon={DollarSign} label="Price" value={`$${richPlan.price_per_hour}/hr`} />
            )}
            <SpecRow icon={Shield} label="DDoS" value="Included" />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          {ip && <SpecRow icon={Network} label="IP" value={ip} />}
          {location && <SpecRow icon={MapPin} label="Location" value={location} />}
          {template && <SpecRow icon={Monitor} label="Template" value={template} />}
          {project && <SpecRow icon={Globe} label="Project" value={project} />}
        </div>
      </CardContent>

      {(onPowerAction || onDestroy) && !isTransient && (
        <CardFooter className="gap-2">
          {status === "running" && onPowerAction && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPowerAction(id, "restart_vps")}
              >
                Restart
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPowerAction(id, "stop_vps")}
              >
                Stop
              </Button>
            </>
          )}
          {status === "stopped" && onPowerAction && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPowerAction(id, "start_vps")}
            >
              Start
            </Button>
          )}
          {onDestroy && (
            <Button
              size="sm"
              variant="destructive"
              className="ml-auto"
              onClick={() => onDestroy(id)}
            >
              Destroy
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

export { InstanceCard };
