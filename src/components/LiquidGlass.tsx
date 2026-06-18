import * as React from 'react';

import { cn } from '@/lib/utils';
import { useLiquidPointer } from '@/hooks/use-liquid-pointer';

interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Use the stronger blur/refraction tier (hero chrome). */
  strong?: boolean;
}

/**
 * LiquidGlass — a premium glass panel that inherits the gated backdrop
 * refraction (via `.liquid-glass`/`.glass-strong`) and adds the pointer-
 * reactive specular highlight. Backdrop warp + chromatic aberration render in
 * Chromium when enabled; elsewhere it's a clean blur-glass. Modular wrapper for
 * the demo and any explicit premium surface.
 */
export const LiquidGlass = React.forwardRef<HTMLDivElement, LiquidGlassProps>(
  ({ strong = false, className, ...props }, forwardedRef) => {
    const { ref, onPointerMove, onPointerLeave } = useLiquidPointer<HTMLDivElement>();

    return (
      <div
        ref={(node) => {
          ref.current = node;
          if (typeof forwardedRef === 'function') forwardedRef(node);
          else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className={cn(strong ? 'glass-strong liquid-glass' : 'liquid-glass', 'rounded-2xl', className)}
        {...props}
      />
    );
  },
);
LiquidGlass.displayName = 'LiquidGlass';
