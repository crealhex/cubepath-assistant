import * as React from "react";
import { cn } from "../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

export interface SshKeyOption {
  id: number | string;
  name: string;
  fingerprint?: string;
}

export interface SshKeyPickerProps {
  keys: SshKeyOption[];
  selected: string[];
  onToggle?: (keyName: string) => void;
  className?: string;
}

function SshKeyPicker({
  keys,
  selected,
  onToggle,
  className,
}: SshKeyPickerProps) {
  if (keys.length === 0) {
    return (
      <Card className={cn("w-full max-w-md", className)}>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">
            No SSH keys found in your account. You can add one in the CubePath dashboard,
            or use a password instead.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Select SSH keys</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        {keys.map((k) => {
          const isSelected = selected.includes(k.name);
          return (
            <button
              key={k.id}
              type="button"
              onClick={() => onToggle?.(k.name)}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition-all",
                "hover:border-brand/50 hover:bg-brand/5",
                isSelected
                  ? "border-brand bg-brand/10"
                  : "border-border",
              )}
            >
              <div
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                  isSelected
                    ? "border-brand bg-brand text-white"
                    : "border-muted-foreground/40",
                )}
              >
                {isSelected && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs font-medium truncate">{k.name}</span>
                {k.fingerprint && (
                  <span className="text-[10px] text-muted-foreground font-mono truncate">
                    {k.fingerprint}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}

export { SshKeyPicker };
