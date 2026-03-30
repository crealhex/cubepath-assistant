import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from "cubepath-ui";
import type { Resource } from "@/services/mcp-client";

const STATUS_VARIANT: Record<string, "operational" | "degraded" | "maintenance" | "outage"> = {
  operational: "operational",
  degraded: "degraded",
  maintenance: "maintenance",
  outage: "outage",
};

interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Card className="gap-3 p-4">
      <CardHeader className="p-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{resource.name}</CardTitle>
          <Badge variant={STATUS_VARIANT[resource.status] ?? "outline"} className="text-2xs">
            {resource.status}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          {resource.type} — {resource.region}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-x-4 gap-y-1 p-0 text-xs text-muted-foreground">
        {Object.entries(resource.meta).map(([key, val]) => (
          <span key={key}>
            <span className="font-medium text-foreground">{key}:</span> {val}
          </span>
        ))}
      </CardContent>
    </Card>
  );
}
