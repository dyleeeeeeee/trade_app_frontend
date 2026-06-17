import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Badge — compact status/label token. Pill radius is intentional here (one of
 * the few places fully-rounded is correct). Feedback variants use tinted
 * surfaces + solid text so state never relies on color alone when paired
 * with an icon or letter.
 */
const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-caption font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-interactive focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-interactive/15 text-interactive",
        neutral: "bg-surface-overlay text-text-secondary",
        outline: "border border-line text-text-secondary",
        success: "bg-feedback-success/15 text-feedback-success",
        warning: "bg-feedback-warning/15 text-feedback-warning",
        error: "bg-feedback-error/15 text-feedback-error",
        info: "bg-feedback-info/15 text-feedback-info",
        /* legacy aliases */
        secondary: "bg-surface-overlay text-text-secondary",
        destructive: "bg-feedback-error/15 text-feedback-error",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
