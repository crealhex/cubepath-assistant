import { useEffect, useState } from "react";
import { Skeleton } from "cubepath-ui";
import { useMcpClient } from "@/providers/app-provider";
import type { Resource } from "@/services/mcp-client";
import { ResourceCard } from "./resource-card";

export function InfraSidebar() {
  const mcpClient = useMcpClient();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mcpClient.getResources().then((r) => {
      setResources(r);
      setLoading(false);
    });
  }, [mcpClient]);

  return (
    <aside className="flex w-80 shrink-0 flex-col gap-3 overflow-y-auto border-l border-border p-4">
      <h2 className="text-sm font-semibold text-muted-foreground">Infrastructure</h2>
      {loading ? (
        <>
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </>
      ) : (
        resources.map((r) => <ResourceCard key={r.id} resource={r} />)
      )}
    </aside>
  );
}
