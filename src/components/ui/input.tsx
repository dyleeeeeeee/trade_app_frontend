import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <motion.input
        type="text"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200",
          className,
        )}
        ref={ref}
        whileFocus={{
          scale: 1.01,
          boxShadow: "0 0 0 2px rgba(var(--primary), 0.2)",
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 25
          }
        }}
        whileHover={{
          boxShadow: "0 0 0 1px rgba(var(--primary), 0.1)",
          transition: { duration: 0.2 }
        }}
        style={{
          willChange: 'transform, box-shadow'
        }}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
