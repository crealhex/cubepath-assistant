import * as React from "react";
import { cn } from "../lib/utils";
import { Card, CardContent } from "./card";
import { Button } from "./button";

export interface ErrorCardProps {
  title?: string;
  message: string;
  suggestion?: string;
  onRetry?: () => void;
  className?: string;
}

function ErrorCard({
  title = "Something went wrong",
  message,
  suggestion,
  onRetry,
  className,
}: ErrorCardProps) {
  return (
    <Card className={cn("w-full max-w-md border-status-outage/30", className)}>
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-status-outage-bg text-status-outage text-xs font-bold">
            !
          </span>
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-sm font-semibold">{title}</span>
            <p className="text-xs text-muted-foreground">{message}</p>
            {suggestion && (
              <p className="text-xs text-muted-foreground/80 italic">{suggestion}</p>
            )}
          </div>
        </div>
        {onRetry && (
          <Button
            size="sm"
            variant="outline"
            className="self-end mt-1"
            onClick={onRetry}
          >
            Retry
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export { ErrorCard };
