import * as React from "react";
import { cn } from "../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

export interface TemplateOption {
  name: string;
  os?: string;
  version?: string | null;
  description?: string;
  recommended_plan?: string;
  icon?: string;
}

export interface TemplatePickerProps {
  title?: string;
  templates: TemplateOption[];
  selected?: string;
  onSelect?: (templateName: string) => void;
  className?: string;
}

function TemplatePicker({
  title = "Select a template",
  templates,
  selected,
  onSelect,
  className,
}: TemplatePickerProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  return (
    <Card className={cn("w-full max-w-lg overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-4">
        <div
          ref={scrollRef}
          className="flex gap-2.5 overflow-x-auto px-6 pb-2 scrollbar-none snap-x snap-mandatory"
        >
          {templates.map((t) => {
            const isSelected = selected === t.name;
            return (
              <button
                key={t.name}
                type="button"
                onClick={() => onSelect?.(t.name)}
                className={cn(
                  "flex flex-col rounded-xl border overflow-hidden transition-all snap-start shrink-0 w-20",
                  "hover:border-brand/50 hover:bg-brand/5",
                  isSelected
                    ? "border-brand bg-brand/10 shadow-sm"
                    : "border-border",
                )}
              >
                <div className="flex flex-1 flex-col items-center justify-center gap-1.5 px-3 pt-3 pb-2">
                  {t.icon ? (
                    <img
                      src={t.icon}
                      alt=""
                      className={cn(
                        "h-8 w-8 object-contain transition-transform",
                        isSelected && "scale-110",
                      )}
                    />
                  ) : (
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground transition-transform",
                        isSelected && "scale-110",
                      )}
                    >
                      {(t.os ?? t.name).charAt(0)}
                    </span>
                  )}
                  <span className="text-[11px] font-medium leading-tight text-center line-clamp-2 w-full">
                    {t.os ?? t.name}
                  </span>
                </div>
                {t.version && (
                  <>
                    <div className="h-px bg-border" />
                    <div className="py-1.5 text-center text-[10px] font-mono text-muted-foreground">
                      {t.version}
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export { TemplatePicker };
