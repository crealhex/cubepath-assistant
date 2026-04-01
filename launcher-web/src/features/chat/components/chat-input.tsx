import { useState, useRef, useCallback } from "react";
import { Button } from "cubepath-ui";
import { ArrowUp } from "lucide-react";
import { VersionBadge } from "@/features/shared/components/version-badge";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function resetHeight() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    requestAnimationFrame(resetHeight);
  }, []);

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    });
    textareaRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="border-t border-border p-4 relative">
      <div className="mx-auto max-w-[720px]">
        <div
          className={`rounded-xl border bg-muted/30 transition-shadow ${
            focused
              ? "border-ring ring-[3px] ring-ring/50"
              : "border-border"
          }`}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Ask CubePath anything..."
            rows={1}
            className="block w-full resize-none overflow-hidden bg-transparent px-4 pt-3 pb-2 text-lg placeholder:text-muted-foreground focus:outline-none min-h-[36px] max-h-[200px]"
          />
          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-1">
              {/* future: attachment button, model picker, etc. */}
            </div>
            <Button
              size="icon"
              disabled={disabled || !value.trim()}
              onClick={handleSubmit}
              className="size-8 rounded-lg"
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>
        </div>
      </div>
      <VersionBadge className="absolute right-4 bottom-5" />
    </div>
  );
}
