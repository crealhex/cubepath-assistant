import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const chatBubbleVariants = cva(
  "relative max-w-[80%] px-4 py-2.5 text-sm leading-relaxed transition-colors",
  {
    variants: {
      variant: {
        user: "rounded-2xl rounded-br-sm bg-primary text-primary-foreground",
        assistant:
          "rounded-2xl rounded-bl-sm border-l-2 border-brand bg-muted text-foreground",
      },
    },
    defaultVariants: {
      variant: "assistant",
    },
  },
);

function LoadingDots() {
  return (
    <div className="flex items-center gap-1 py-0.5" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-current opacity-40 animate-pulse"
          style={{ animationDelay: `${i * 150}ms`, animationDuration: "1.4s" }}
        />
      ))}
    </div>
  );
}

type ChatBubbleProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof chatBubbleVariants> & {
    /** Optional timestamp displayed below the bubble */
    timestamp?: string;
    /** Optional avatar node displayed beside the bubble */
    avatar?: React.ReactNode;
    /** Show animated loading dots instead of children */
    isLoading?: boolean;
  };

const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  (
    { className, variant = "assistant", timestamp, avatar, isLoading, children, ...props },
    ref,
  ) => {
    const isUser = variant === "user";

    return (
      <div
        className={cn(
          "flex gap-2.5",
          isUser ? "justify-end" : "justify-start",
        )}
      >
        {!isUser && avatar && (
          <div className="flex shrink-0 items-end">{avatar}</div>
        )}

        <div className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
          <div
            ref={ref}
            className={cn(chatBubbleVariants({ variant, className }))}
            {...props}
          >
            {isLoading ? <LoadingDots /> : children}
          </div>

          {timestamp && (
            <span className="mt-1 px-1 text-xs text-muted-foreground">
              {timestamp}
            </span>
          )}
        </div>

        {isUser && avatar && (
          <div className="flex shrink-0 items-end">{avatar}</div>
        )}
      </div>
    );
  },
);

ChatBubble.displayName = "ChatBubble";

export { ChatBubble, chatBubbleVariants };
export type { ChatBubbleProps };
