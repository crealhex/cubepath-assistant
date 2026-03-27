import * as React from "react";

import { cn } from "../lib/utils";

type InlineLinkProps = React.ComponentPropsWithoutRef<"a">;

const InlineLink = React.forwardRef<HTMLAnchorElement, InlineLinkProps>(
  ({ className, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        "text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground",
        className,
      )}
      {...props}
    />
  ),
);

InlineLink.displayName = "InlineLink";

export { InlineLink };
export type { InlineLinkProps };
