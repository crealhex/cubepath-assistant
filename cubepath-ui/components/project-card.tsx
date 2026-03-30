import * as React from "react";
import { cn } from "../lib/utils";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";

export interface ProjectCardProps {
  id: number;
  name: string;
  description?: string;
  vpsCount?: number;
  onViewInstances?: (projectId: number) => void;
  onDeploy?: (projectId: number) => void;
  className?: string;
}

function ProjectCard({
  id,
  name,
  description,
  vpsCount = 0,
  onViewInstances,
  onDeploy,
  className,
}: ProjectCardProps) {
  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand text-sm font-bold">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <span className="text-sm font-semibold truncate">{name}</span>
          {description && (
            <span className="text-xs text-muted-foreground truncate">{description}</span>
          )}
        </div>
        <Badge variant="secondary" className="shrink-0">
          {vpsCount} {vpsCount === 1 ? "instance" : "instances"}
        </Badge>
      </CardContent>
    </Card>
  );
}

export { ProjectCard };
