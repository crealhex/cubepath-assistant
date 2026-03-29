import { cva } from "class-variance-authority";

import { cn } from "../lib/utils";

const pricingCardVariants = cva(
  "relative flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md",
  {
    variants: {
      featured: {
        true: "border-brand shadow-[0_0_16px_-4px_rgba(0,217,87,0.25)]",
        false: "border-border",
      },
    },
    defaultVariants: {
      featured: false,
    },
  },
);

export interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  features: string[];
  featured?: boolean;
  ctaText: string;
  ctaHref: string;
  badge?: string;
  className?: string;
}

function PricingCard({
  name,
  price,
  period = "/mo",
  features,
  featured = false,
  ctaText,
  ctaHref,
  badge,
  className,
}: PricingCardProps) {
  return (
    <div className={cn(pricingCardVariants({ featured }), className)}>
      {/* Header */}
      <div className="flex flex-col gap-1.5 p-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            {name}
          </h3>
          {badge && (
            <span className="inline-flex items-center rounded-full bg-brand/10 text-brand border border-brand/20 px-2.5 py-0.5 text-xs font-medium">
              {badge}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight">{price}</span>
          <span className="text-sm text-muted-foreground">{period}</span>
        </div>
      </div>

      {/* Features */}
      <div className="flex-1 p-6 pt-0">
        <ul className="flex flex-col gap-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="p-6 pt-0">
        <a
          href={ctaHref}
          className={cn(
            "inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all active:scale-[0.98] focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-hidden h-10 px-6 text-base shadow-xs",
            featured
              ? "bg-brand text-white hover:bg-brand/90"
              : "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
          )}
        >
          {ctaText}
        </a>
      </div>
    </div>
  );
}

export { PricingCard };
