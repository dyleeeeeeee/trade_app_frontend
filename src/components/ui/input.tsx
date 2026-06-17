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
          "flex h-10 w-full rounded-lg border border-line bg-surface-base px-3 py-2 text-body-sm text-text-primary",
          "transition-[border-color,box-shadow] duration-micro ease-standard",
          "placeholder:text-text-tertiary",
          "file:border-0 file:bg-transparent file:text-body-sm file:font-medium file:text-text-primary",
          "focus-visible:outline-none focus-visible:border-interactive focus-visible:shadow-focus",
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
