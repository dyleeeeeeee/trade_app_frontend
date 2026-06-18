import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Input — 44px frosted glass field. Pass `icon` to render a leading icon that
 * sits INSIDE the field, vertically centered, as a flex child (it can never
 * stack above the input). Optional `trailing` slot for a button/adornment.
 * Labels live above the field (Label component), never floating inside.
 */
const fieldShell =
  "h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] text-body-sm text-text-primary backdrop-blur-xl " +
  "transition-[border-color,box-shadow,background-color] duration-micro ease-standard " +
  "placeholder:text-text-tertiary disabled:cursor-not-allowed disabled:opacity-40";

interface InputProps extends React.ComponentProps<"input"> {
  /** Leading icon rendered inside the field (flex child, centered). */
  icon?: LucideIcon;
  /** Optional trailing adornment (e.g. a clear/visibility button). */
  trailing?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", icon: Icon, trailing, ...props }, ref) => {
    // Plain field (no icon/trailing) — input carries the shell directly.
    if (!Icon && !trailing) {
      return (
        <input
          type={type}
          ref={ref}
          className={cn(
            fieldShell,
            "px-3.5 py-2 file:border-0 file:bg-transparent file:text-body-sm file:font-medium file:text-text-primary",
            "hover:border-white/[0.14] focus-visible:outline-none focus-visible:border-interactive/60 focus-visible:bg-white/[0.06] focus-visible:shadow-focus",
            "aria-[invalid=true]:border-feedback-error aria-[invalid=true]:focus-visible:shadow-[0_0_0_3px_hsl(var(--feedback-error)/0.25)]",
            className,
          )}
          {...props}
        />
      );
    }

    // Adorned field — a flex row holds the icon + a borderless input. The
    // shell (border/bg/focus) lives on the wrapper via focus-within.
    const invalid = props["aria-invalid"];
    return (
      <div
        data-invalid={invalid ? "true" : undefined}
        className={cn(
          fieldShell,
          "flex items-center gap-2.5 px-3.5",
          "hover:border-white/[0.14] focus-within:border-interactive/60 focus-within:bg-white/[0.06] focus-within:shadow-focus",
          "data-[invalid=true]:border-feedback-error data-[invalid=true]:focus-within:shadow-[0_0_0_3px_hsl(var(--feedback-error)/0.25)]",
          className,
        )}
      >
        {Icon && <Icon className="h-4 w-4 shrink-0 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />}
        <input
          type={type}
          ref={ref}
          className="h-full w-full min-w-0 border-0 bg-transparent p-0 text-body-sm text-text-primary outline-none placeholder:text-text-tertiary disabled:cursor-not-allowed"
          {...props}
        />
        {trailing && <span className="flex shrink-0 items-center text-text-tertiary">{trailing}</span>}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
