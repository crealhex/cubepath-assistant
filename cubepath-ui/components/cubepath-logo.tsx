import { cn } from "../lib/utils";

// --- Animation Strategies ---

export type AnimationName = "pulse" | "glow" | "rotate" | "breathe";

const animationClasses: Record<AnimationName, { outer?: string; inner?: string }> = {
  pulse: {
    outer: "animate-[logo-pulse_2s_ease-in-out_infinite]",
  },
  glow: {
    outer: "animate-[logo-glow_2s_ease-in-out_infinite]",
  },
  rotate: {
    inner: "animate-[logo-rotate_3s_linear_infinite]",
  },
  breathe: {
    outer: "animate-[logo-breathe_0.8s_ease-in-out_infinite]",
  },
};

function getAnimationClasses(animations: AnimationName[], active: boolean) {
  if (!active) return { outer: "", inner: "" };

  let outer = "";
  let inner = "";

  for (const name of animations) {
    const strat = animationClasses[name];
    if (strat.outer) outer += ` ${strat.outer}`;
    if (strat.inner) inner += ` ${strat.inner}`;
  }

  return { outer: outer.trim(), inner: inner.trim() };
}

// --- Logo Avatar Component ---

interface CubePathLogoProps {
  /** Image source for the logo icon */
  src: string;
  size?: "sm" | "md" | "lg";
  streaming?: boolean;
  animations?: AnimationName[];
  className?: string;
}

const sizeClasses = {
  sm: "size-8",
  md: "size-10",
  lg: "size-16",
};

function CubePathLogo({
  src,
  size = "md",
  streaming = false,
  animations = ["glow"],
  className,
}: CubePathLogoProps) {
  const { outer, inner } = getAnimationClasses(animations, streaming);

  return (
    <div className={cn("relative shrink-0", sizeClasses[size], outer, className)}>
      <div className={cn("size-full", inner)}>
        <img src={src} alt="CubePath" className="size-full object-contain" />
      </div>
    </div>
  );
}

export { CubePathLogo };
export type { CubePathLogoProps };
