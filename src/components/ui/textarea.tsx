import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-line bg-surface-base px-3 py-2 text-body-sm text-text-primary placeholder:text-text-tertiary transition-[border-color,box-shadow] duration-micro ease-standard focus-visible:outline-none focus-visible:border-interactive focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-40 aria-[invalid=true]:border-feedback-error",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
