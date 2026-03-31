import * as React from "react";
import { cn } from "../lib/utils";
import { Badge } from "./badge";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Cpu, MemoryStick, HardDrive, Globe, MapPin, Monitor, Network } from "lucide-react";

type DeployState = "requested" | "deploying" | "active" | "error";

const steps: { key: DeployState; label: string }[] = [
  { key: "requested", label: "Requested" },
  { key: "deploying", label: "Deploying" },
  { key: "active", label: "Active" },
];

const stateConfig: Record<DeployState, { label: string; variant: "maintenance" | "operational" | "outage" | "degraded"; pulse?: boolean }> = {
  requested: { label: "Requested", variant: "maintenance", pulse: true },
  deploying: { label: "Deploying", variant: "maintenance", pulse: true },
  active: { label: "Active", variant: "operational" },
  error: { label: "Failed", variant: "outage" },
};

function stepIndex(state: DeployState): number {
  if (state === "error") return -1;
  return steps.findIndex((s) => s.key === state);
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

export interface DeployCardProps {
  name: string;
  state: DeployState;
  plan: string;
  cpu?: number;
  ram?: number;
  storage?: number;
  bandwidth?: number;
  location: string;
  template: string;
  ip?: string;
  className?: string;
}

function DeployCard({
  name,
  state,
  plan,
  cpu,
  ram,
  storage,
  bandwidth,
  location,
  template,
  ip,
  className,
}: DeployCardProps) {
  const current = stepIndex(state);
  const isError = state === "error";
  const config = stateConfig[state];

  return (
    <Card className={cn("w-full max-w-sm", className)}>
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 pb-3">
        <div className="flex flex-col gap-0.5 min-w-0">
          <CardTitle className="text-sm font-semibold truncate">{name}</CardTitle>
          <span className="text-2xs font-mono text-muted-foreground uppercase">{plan}</span>
        </div>
        <Badge variant={config.variant} className={cn(config.pulse && "animate-pulse")}>
          {config.label}
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {/* Progress stepper */}
        <div className="flex items-center gap-1 pb-2 border-b border-border">
          {steps.map((step, i) => {
            const isDone = !isError && i < current;
            const isActive = !isError && i === current;
            const isPending = isError || i > current;

            return (
              <React.Fragment key={step.key}>
                {i > 0 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 rounded-full transition-colors duration-500",
                      isDone ? "bg-status-operational" : "bg-border",
                    )}
                  />
                )}
                <div className="flex flex-col items-center gap-1.5">
                  {isError && i === 0 ? (
                    <span className="text-status-outage text-xs font-bold leading-none">&#10007;</span>
                  ) : (
                    <div
                      className={cn(
                        "h-2.5 w-2.5 rounded-full border-2 transition-all duration-500",
                        isDone && "border-status-operational bg-status-operational",
                        isActive && "border-status-maintenance bg-status-maintenance animate-pulse",
                        isPending && "border-border bg-transparent",
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      "text-2xs leading-none whitespace-nowrap transition-colors duration-300",
                      isDone && "text-status-operational",
                      isActive && "text-foreground font-medium",
                      isPending && "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Resource specs */}
        <div className="flex flex-col gap-1.5">
          {cpu != null && <SpecRow icon={Cpu} label="vCPU" value={`${cpu}`} />}
          {ram != null && <SpecRow icon={MemoryStick} label="RAM" value={`${ram >= 1024 ? `${ram / 1024} GB` : `${ram} MB`}`} />}
          {storage != null && <SpecRow icon={HardDrive} label="Storage" value={`${storage} GB NVMe`} />}
          {bandwidth != null && <SpecRow icon={Globe} label="Bandwidth" value={`${bandwidth} TB`} />}
          <SpecRow icon={MapPin} label="Location" value={location} />
          <SpecRow icon={Monitor} label="Template" value={template} />
          {ip && <SpecRow icon={Network} label="IP" value={ip} />}
        </div>
      </CardContent>
    </Card>
  );
}

export { DeployCard };
export type { DeployState };
