import { ChevronDown, ChevronUp } from "lucide-react";

interface ShowMoreButtonProps {
  expanded: boolean;
  remaining: number;
  onClick: () => void;
}

export function ShowMoreButton({ expanded, remaining, onClick }: ShowMoreButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-1.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border-t border-border"
    >
      {expanded ? (
        <>Show less <ChevronUp className="size-3.5" /></>
      ) : (
        <>Show {remaining} more <ChevronDown className="size-3.5" /></>
      )}
    </button>
  );
}
