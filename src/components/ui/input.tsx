import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Input — 40px standard. Border shifts to interactive on focus with a 3px
 * focus glow. Error state sets `aria-invalid` and recolors border + glow.
 * Labels live above the field (Label component), never floating inside.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-body-sm text-text-primary backdrop-blur-xl",
          "transition-[border-color,box-shadow,background-color] duration-micro ease-standard",
          "placeholder:text-text-tertiary",
          "file:border-0 file:bg-transparent file:text-body-sm file:font-medium file:text-text-primary",
          "hover:border-white/[0.14]",
          "focus-visible:outline-none focus-visible:border-interactive/60 focus-visible:bg-white/[0.06] focus-visible:shadow-focus",
          "disabled:cursor-not-allowed disabled:opacity-40",
          "aria-[invalid=true]:border-feedback-error aria-[invalid=true]:focus-visible:shadow-[0_0_0_3px_hsl(var(--feedback-error)/0.25)]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
