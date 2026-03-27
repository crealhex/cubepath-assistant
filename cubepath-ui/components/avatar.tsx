import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
  {
    variants: {
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

type AvatarContextValue = {
  imageLoaded: boolean;
  setImageLoaded: React.Dispatch<React.SetStateAction<boolean>>;
};

const AvatarContext = React.createContext<AvatarContextValue>({
  imageLoaded: false,
  setImageLoaded: () => {},
});

// --- Avatar (root) ---

export type AvatarProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof avatarVariants>;

function Avatar({ className, size, ...props }: AvatarProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <AvatarContext.Provider value={{ imageLoaded, setImageLoaded }}>
      <span
        className={cn(avatarVariants({ size }), className)}
        {...props}
      />
    </AvatarContext.Provider>
  );
}

// --- AvatarImage ---

export type AvatarImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

function AvatarImage({ className, src, alt, ...props }: AvatarImageProps) {
  const { imageLoaded, setImageLoaded } = React.useContext(AvatarContext);

  React.useEffect(() => {
    if (!src) {
      setImageLoaded(false);
      return;
    }

    const img = new Image();
    img.src = src;

    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(false);

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, setImageLoaded]);

  if (!imageLoaded) return null;

  return (
    <img
      className={cn("h-full w-full rounded-full object-cover", className)}
      src={src}
      alt={alt}
      {...props}
    />
  );
}

// --- AvatarFallback ---

export type AvatarFallbackProps = React.HTMLAttributes<HTMLSpanElement>;

function AvatarFallback({ className, children, ...props }: AvatarFallbackProps) {
  const { imageLoaded } = React.useContext(AvatarContext);

  if (imageLoaded) return null;

  return (
    <span
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-medium",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Avatar, AvatarImage, AvatarFallback, avatarVariants };
