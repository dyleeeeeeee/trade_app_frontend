import { useCallback, useRef } from 'react';

/**
 * Pointer-reactive specular highlight for `.liquid-glass` surfaces. Sets the
 * `--lx`/`--ly` (and `--l-op`) CSS variables the `.liquid-glass::after`
 * highlight reads, so light appears to track the pointer under the glass.
 */
export function useLiquidPointer<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--lx', `${e.clientX - r.left}px`);
    el.style.setProperty('--ly', `${e.clientY - r.top}px`);
    el.style.setProperty('--l-op', '0.95');
  }, []);
  const onPointerLeave = useCallback(() => {
    ref.current?.style.setProperty('--l-op', '0.4');
  }, []);
  return { ref, onPointerMove, onPointerLeave };
}
