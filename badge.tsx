import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-transparent bg-surface-3 text-foreground",
        electric: "border-transparent bg-electric/15 text-electric-glow",
        emerald: "border-transparent bg-emerald/15 text-emerald-glow",
        amber: "border-transparent bg-amber/15 text-amber",
        crimson: "border-transparent bg-crimson/15 text-crimson",
        outline: "border-border text-muted",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
