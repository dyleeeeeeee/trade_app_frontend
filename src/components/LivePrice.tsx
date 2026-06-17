import * as React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "flat";

function formatPrice(value: number, opts?: Intl.NumberFormatOptions) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: value < 10 ? 4 : 2,
    ...opts,
  });
}

interface LivePriceProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  prefix?: string;
  /** Show a brief directional tint when the value changes. Default on. */
  flash?: boolean;
}

/**
 * LivePrice — a numeric price that acknowledges its own change. On each new
 * value it flashes a short green/red tint (the "tick" you feel on a real
 * trading screen). Tint is a fast color transition, so reduced-motion users
 * still get the (instant) state without distracting movement.
 */
export function LivePrice({ value, prefix = "$", flash = true, className, ...props }: LivePriceProps) {
  const prev = React.useRef(value);
  const [dir, setDir] = React.useState<Direction>("flat");

  React.useEffect(() => {
    if (!flash) return;
    if (value > prev.current) setDir("up");
    else if (value < prev.current) setDir("down");
    prev.current = value;
    const t = setTimeout(() => setDir("flat"), 600);
    return () => clearTimeout(t);
  }, [value, flash]);

  return (
    <span
      aria-live="polite"
      className={cn(
        "tabular-nums transition-colors duration-interaction ease-standard",
        dir === "up" && "text-feedback-success",
        dir === "down" && "text-feedback-error",
        className,
      )}
      {...props}
    >
      {prefix}
      {formatPrice(value)}
    </span>
  );
}

interface PriceChangeProps {
  changePercent: number;
  className?: string;
}

/** Directional change pill — never relies on color alone (arrow + sign). */
export function PriceChange({ changePercent, className }: PriceChangeProps) {
  const positive = changePercent >= 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-caption font-medium tabular-nums",
        positive ? "bg-feedback-success/15 text-feedback-success" : "bg-feedback-error/15 text-feedback-error",
        className,
      )}
    >
      <Icon className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
      {positive ? "+" : ""}
      {changePercent.toFixed(2)}%
    </span>
  );
}
