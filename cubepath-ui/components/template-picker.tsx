import * as React from "react";
import { cn } from "../lib/utils";

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

function TemplateItem({
  t,
  isSelected,
  onSelect,
}: {
  t: TemplateOption;
  isSelected: boolean;
  onSelect?: (name: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(t.name)}
      className={cn(
        "flex flex-col rounded-xl border overflow-hidden transition-all snap-start shrink-0 w-20",
        "hover:border-primary/40",
        isSelected ? "border-primary shadow-sm" : "border-border",
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
        <span className="text-xs font-medium leading-tight text-center line-clamp-2 w-full">
          {t.os ?? t.name}
        </span>
      </div>
      {t.version && (
        <>
          <div className="h-px bg-border" />
          <div className="py-1.5 text-center text-2xs font-mono text-muted-foreground">
            {t.version}
          </div>
        </>
      )}
    </button>
  );
}

function TemplatePicker({
  title = "Select a template",
  templates,
  selected,
  onSelect,
  className,
}: TemplatePickerProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const isScrolling = React.useRef(false);

  // 3x the list: [clone] [original] [clone]
  const tripled = [...templates, ...templates, ...templates];

  // Start at the middle set on mount
  React.useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Each item is ~80px (w-20) + 10px gap
    const itemWidth = 90;
    el.scrollLeft = templates.length * itemWidth;
  }, [templates.length]);

  // When scroll reaches a clone boundary, jump to the matching position in the middle set
  function handleScroll() {
    if (isScrolling.current) return;
    const el = scrollRef.current;
    if (!el) return;

    const itemWidth = 90;
    const setWidth = templates.length * itemWidth;
    const middleStart = setWidth;
    const middleEnd = setWidth * 2;

    if (el.scrollLeft < middleStart - itemWidth / 2) {
      isScrolling.current = true;
      el.scrollLeft += setWidth;
      isScrolling.current = false;
    } else if (el.scrollLeft > middleEnd - itemWidth / 2) {
      isScrolling.current = true;
      el.scrollLeft -= setWidth;
      isScrolling.current = false;
    }
  }

  return (
    <div className="min-w-full">
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-sm font-semibold">{title}</span>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none"
      >
        {tripled.map((t, i) => (
          <TemplateItem
            key={`${t.name}-${i}`}
            t={t}
            isSelected={selected === t.name}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
</div>
  );
}

export { TemplatePicker };
