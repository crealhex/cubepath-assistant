export function GroupSkeleton({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: Math.max(1, count) }, (_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border border-border/60 px-4 py-4 animate-pulse">
          <div className="h-4 w-4 rounded-full bg-muted" />
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="h-3 w-32 rounded bg-muted" />
            <div className="h-2.5 w-20 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
