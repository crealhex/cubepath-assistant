import * as React from "react";
import { cn } from "../lib/utils";

export type CodeBlockProps = React.HTMLAttributes<HTMLDivElement> & {
  code: string;
  language?: string;
  copyable?: boolean;
};

function CodeBlock({
  code,
  language,
  copyable = true,
  className,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn("relative rounded-lg border border-border bg-[var(--muted)]", className)}
      {...props}
    >
      {(language || copyable) && (
        <div className="flex items-center justify-between px-4 pt-3">
          {language ? (
            <span className="text-xs font-medium text-[var(--foreground)]/60 font-mono uppercase tracking-wide">
              {language}
            </span>
          ) : (
            <span />
          )}
          {copyable && (
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-[var(--foreground)]/60 transition-colors hover:bg-[var(--foreground)]/5 hover:text-[var(--foreground)]"
            >
              {copied ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          )}
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono text-[var(--foreground)]">{code}</code>
      </pre>
    </div>
  );
}

export { CodeBlock };
