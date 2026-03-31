import { CodeBlock } from "cubepath-ui";
import type { Components } from "react-markdown";
import { highlight } from "sugar-high";

export const PROSE_CLASSES =
  "prose max-w-none break-words " +
  "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0 " +
  "prose-pre:bg-transparent prose-pre:m-0 " +
  "prose-code:bg-transparent prose-code:p-0 " +
  "prose-code:before:content-none prose-code:after:content-none";

export const markdownComponents: Components = {
  code({ className, children }) {
    const match = /language-(\w+)/.exec(className || "");
    const code = String(children).replace(/\n$/, "");
    if (!match) {
      return <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">{children}</code>;
    }
    return <CodeBlock code={code} language={match[1]} highlightedHtml={highlight(code)} />;
  },
  pre({ children }) {
    return <>{children}</>;
  },
};
