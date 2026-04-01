import { useState, useRef } from "react";
import { Input, Button } from "cubepath-ui";
import { ArrowUp } from "lucide-react";
import { VersionBadge } from "@/components/version-badge";

interface ChatInputV2Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInputV2({ onSend, disabled }: ChatInputV2Props) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    inputRef.current?.focus();
  }

  return (
    <div className="border-t border-border p-4 relative">
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-[720px] gap-2">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask CubePath anything..."
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={disabled || !value.trim()}>
          <ArrowUp className="size-4" />
        </Button>
      </form>
      <VersionBadge className="absolute right-4 top-1/2 -translate-y-1/2" />
    </div>
  );
}
