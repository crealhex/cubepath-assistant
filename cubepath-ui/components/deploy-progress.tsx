import * as React from "react";
import { cn } from "../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

type DeployStep = "initiated" | "provisioning" | "configuring" | "ready" | "error";

const steps: { key: DeployStep; label: string }[] = [
  { key: "initiated", label: "Initiated" },
  { key: "provisioning", label: "Provisioning" },
  { key: "configuring", label: "Configuring" },
  { key: "ready", label: "Ready" },
];

function stepIndex(step: DeployStep): number {
  if (step === "error") return -1;
  return steps.findIndex((s) => s.key === step);
}

export interface DeployProgressProps {
  name: string;
  plan?: string;
  location?: string;
  currentStep: DeployStep;
  className?: string;
}

function DeployProgress({
  name,
  plan,
  location,
  currentStep,
  className,
}: DeployProgressProps) {
  const current = stepIndex(currentStep);
  const isError = currentStep === "error";
  const isComplete = currentStep === "ready";

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          {isComplete ? (
            <span className="text-status-operational">&#10003;</span>
          ) : isError ? (
            <span className="text-status-outage">&#10007;</span>
          ) : (
            <span className="inline-block h-3 w-3 rounded-full bg-status-maintenance animate-pulse" />
          )}
          Deploying {name}
        </CardTitle>
        {(plan || location) && (
          <span className="text-xs text-muted-foreground">
            {[plan, location].filter(Boolean).join(" \u00B7 ")}
          </span>
        )}
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-1">
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
                  <div
                    className={cn(
                      "h-3 w-3 rounded-full border-2 transition-all duration-500",
                      isDone && "border-status-operational bg-status-operational",
                      isActive && "border-status-maintenance bg-status-maintenance animate-pulse",
                      isPending && "border-border bg-transparent",
                      isError && i === 0 && "border-status-outage bg-status-outage",
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] leading-none whitespace-nowrap transition-colors duration-300",
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
      </CardContent>
    </Card>
  );
}

export { DeployProgress };
export type { DeployStep };
