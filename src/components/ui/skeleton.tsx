import { cn } from "@/lib/utils";

/** Skeleton — content-area loading. Gradient sweep (1.5s) over a raised tint. */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("shimmer rounded-md bg-surface-overlay/60", className)}
      {...props}
    />
  );
}

export { Skeleton };
