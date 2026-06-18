/**
 * Capability gate for the SVG glass-refraction effect.
 *
 * `backdrop-filter: url(#…)` only renders in Chromium; Safari/Firefox would
 * reject the whole declaration and lose the blur, so we enable the effect
 * conservatively and let everything else keep the plain blur-glass. We also
 * respect reduced-motion and skip low-end devices (the effect is GPU-heavy).
 *
 * When enabled, `.glass-refract-on` is toggled on <html>; index.css augments
 * the glass utilities under that class. Default OFF until proven.
 */
function supportsBackdropUrl(): boolean {
  if (typeof document === 'undefined' || typeof navigator === 'undefined') return false;

  const ua = navigator.userAgent;
  const isSafari = /^((?!chrome|chromium|android|crios|fxios).)*safari/i.test(ua);
  const isFirefox = /firefox|fxios/i.test(ua);
  if (isSafari || isFirefox) return false;

  // Runtime probe: Chromium accepts url() on backdrop-filter; others reject it.
  const el = document.createElement('div');
  el.style.backdropFilter = 'url(#__glass_probe__)';
  return /url\(/.test(el.style.backdropFilter || '');
}

function isLowEnd(): boolean {
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  const cores = navigator.hardwareConcurrency;
  if (typeof mem === 'number' && mem < 4) return true;
  if (typeof cores === 'number' && cores < 4) return true;
  return false;
}

/** Evaluate + apply the gate. Returns a cleanup that detaches listeners. */
export function initGlassRefraction(): () => void {
  if (typeof window === 'undefined') return () => {};

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const capable = supportsBackdropUrl() && !isLowEnd();

  const apply = () => {
    root.classList.toggle('glass-refract-on', capable && !reduce.matches);
  };
  apply();

  const onChange = () => apply();
  reduce.addEventListener?.('change', onChange);
  return () => reduce.removeEventListener?.('change', onChange);
}
