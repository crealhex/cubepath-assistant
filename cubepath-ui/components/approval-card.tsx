import { cn } from "../lib/utils";
import { Button } from "./button";
import { Badge } from "./badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { ShieldCheck } from "lucide-react";

export type ApprovalStatus = "pending" | "accepted" | "rejected";

export interface ApprovalAction {
  label: string;
  value: string;
}

export interface ApprovalCardProps {
  title: string;
  description?: string;
  details?: Array<{ label: string; value: string }>;
  cost?: string;
  status?: ApprovalStatus;
  onAccept?: () => void;
  onReject?: () => void;
  className?: string;
}

const statusConfig: Record<ApprovalStatus, { label: string; variant: "maintenance" | "operational" | "outage" }> = {
  pending: { label: "Awaiting approval", variant: "maintenance" },
  accepted: { label: "Approved", variant: "operational" },
  rejected: { label: "Rejected", variant: "outage" },
};

function ApprovalCard({
  title,
  description,
  details,
  cost,
  status = "pending",
  onAccept,
  onReject,
  className,
}: ApprovalCardProps) {
  const config = statusConfig[status];
  const isPending = status === "pending";

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-muted-foreground" />
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        </div>
        <Badge variant={config.variant} className={cn(isPending && "animate-pulse")}>
          {config.label}
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}

        {details && details.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {details.map((d) => (
              <div key={d.label} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{d.label}</span>
                <span className="font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        )}

        {cost && (
          <div className="flex items-center justify-between border-t border-border pt-2 text-xs">
            <span className="text-muted-foreground">Estimated cost</span>
            <span className="font-semibold">{cost}</span>
          </div>
        )}
      </CardContent>

      {isPending && (onAccept || onReject) && (
        <CardFooter className="gap-2">
          {onReject && (
            <Button size="sm" variant="outline" onClick={onReject} className="flex-1">
              Reject
            </Button>
          )}
          {onAccept && (
            <Button size="sm" onClick={onAccept} className="flex-1">
              Accept
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

export { ApprovalCard };
