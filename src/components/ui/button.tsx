import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-glow",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-md",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-md",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-gradient-primary text-primary-foreground hover:shadow-glow hover:opacity-90",
        glass: "bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/70 hover:border-primary/30",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// Fluid button animations
const buttonMotionVariants = {
  idle: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.02,
    y: -1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      mass: 0.8
    }
  },
  tap: {
    scale: 0.98,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 600,
      damping: 20,
      mass: 0.5
    }
  },
  disabled: {
    scale: 1,
    y: 0,
    opacity: 0.5
  }
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : motion.button;

    const motionProps: HTMLMotionProps<"button"> = {
      variants: buttonMotionVariants,
      initial: "idle",
      whileHover: disabled ? undefined : "hover",
      whileTap: disabled ? undefined : "tap",
      animate: disabled ? "disabled" : "idle",
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
      style: {
        willChange: 'transform',
        backfaceVisibility: 'hidden'
      }
    };

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      );
    }

    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled}
        {...motionProps}
        {...props}
      >
        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-md"
          initial={{ scale: 0, opacity: 1 }}
          whileTap={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
        {props.children}
      </motion.button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
