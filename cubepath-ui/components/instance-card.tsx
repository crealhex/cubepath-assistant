import * as React from "react";
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

export interface InstanceCardProps {
  id: number;
  name: string;
  status: InstanceStatus;
  project?: string;
  ip?: string;
  plan?: string;
  location?: string;
  template?: string;
  onPowerAction?: (instanceId: number, action: string) => void;
  onDestroy?: (instanceId: number) => void;
  className?: string;
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

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
        <div className="flex flex-col gap-1 min-w-0">
          <CardTitle className="text-sm font-semibold truncate">{name}</CardTitle>
          {project && (
            <span className="text-xs text-muted-foreground truncate">{project}</span>
          )}
        </div>
        <Badge variant={config.variant} className={cn(config.pulse && "animate-pulse")}>
          {config.label}
        </Badge>
      </CardHeader>

      <CardContent>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          {ip && (
            <>
              <dt className="text-muted-foreground">IP</dt>
              <dd className="font-mono">{ip}</dd>
            </>
          )}
          {plan && (
            <>
              <dt className="text-muted-foreground">Plan</dt>
              <dd>{plan}</dd>
            </>
          )}
          {location && (
            <>
              <dt className="text-muted-foreground">Location</dt>
              <dd>{location}</dd>
            </>
          )}
          {template && (
            <>
              <dt className="text-muted-foreground">Template</dt>
              <dd>{template}</dd>
            </>
          )}
        </dl>
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
