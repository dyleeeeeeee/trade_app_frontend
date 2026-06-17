import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Button — full state machine in pure CSS so motion respects
 * `prefers-reduced-motion` for free and acknowledgment stays < 100ms.
 *
 * Default → Hover (lift one elevation + glow) → Active (press, scale 0.98,
 * dim 4%) → Focus-visible (2px offset ring) → Disabled (opacity 0.4).
 */
const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap select-none align-middle",
    "font-medium [&_svg]:pointer-events-none [&_svg]:shrink-0",
    "transition-[transform,box-shadow,background-color,border-color,filter]",
    "duration-micro ease-standard",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
    "active:scale-[0.98] active:brightness-[0.96] active:[transition-duration:80ms] active:ease-accelerate",
    "disabled:pointer-events-none disabled:opacity-40 disabled:active:scale-100 disabled:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-interactive text-interactive-foreground shadow-elevation-1 hover:bg-interactive-hover hover:shadow-glow",
        secondary:
          "bg-surface-raised text-text-primary border border-line shadow-elevation-1 hover:border-line-strong hover:shadow-elevation-2",
        ghost:
          "bg-transparent text-interactive hover:bg-surface-raised",
        destructive:
          "bg-feedback-error text-feedback-error-foreground shadow-elevation-1 hover:brightness-110 hover:shadow-elevation-2",
        "destructive-ghost":
          "bg-transparent text-feedback-error hover:bg-feedback-error/10",
        link: "text-interactive underline-offset-4 hover:underline",
        /* legacy aliases kept so existing pages don't break */
        default:
          "bg-interactive text-interactive-foreground shadow-elevation-1 hover:bg-interactive-hover hover:shadow-glow",
        outline:
          "bg-surface-raised text-text-primary border border-line shadow-elevation-1 hover:border-line-strong hover:shadow-elevation-2",
        premium:
          "bg-gradient-primary text-interactive-foreground shadow-elevation-1 hover:shadow-glow",
        glass:
          "glass border border-hairline/[0.10] text-text-primary hover:border-line",
      },
      size: {
        sm: "h-8 min-w-8 rounded-md px-3 text-body-sm [&_svg]:size-4",
        md: "h-10 min-w-10 rounded-lg px-4 text-body-sm [&_svg]:size-5",
        lg: "h-12 min-w-12 rounded-lg px-6 text-body [&_svg]:size-5",
        "icon-sm": "h-8 w-8 rounded-md [&_svg]:size-4",
        "icon": "h-10 w-10 rounded-lg [&_svg]:size-5",
        "icon-lg": "h-12 w-12 rounded-lg [&_svg]:size-6",
        /* legacy alias */
        default: "h-10 min-w-10 rounded-lg px-4 text-body-sm [&_svg]:size-5",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
