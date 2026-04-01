import { cn } from "../lib/utils";

export interface InlineErrorProps {
  message?: string;
  className?: string;
}

function InlineError({
  message = "Failed to load visual preview",
  className,
}: InlineErrorProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 rounded-xl border border-status-outage/30 px-4 py-3 text-base text-muted-foreground",
      className,
    )}>
      <span className="text-status-outage font-bold">!</span>
      {message}
    </div>
  );
}

export { InlineError };
