export function VersionBadge({ className }: { className?: string }) {
  return (
    <span className={`text-2xs text-muted-foreground/30 font-mono ${className ?? ""}`}>
      {__APP_VERSION__}
    </span>
  );
}
