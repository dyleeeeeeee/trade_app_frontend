/**
 * GlassFilters — shared, hidden inline SVG holding the displacement filters
 * referenced by the glass utilities via `backdrop-filter: url(#…)`. Mounted
 * once at the app root. One def is reused by every glass surface (no per-
 * element SVG), so the cost is a single filter graph.
 *
 * Each filter takes the BACKDROP as SourceGraphic, splits it into R/G/B,
 * displaces each channel by a smoothed fractal-noise field at slightly
 * different scales (RGB fringing / chromatic aberration), then recombines via
 * `screen` — mimicking light bending through a thick crystal lens. A vertical
 * bias on the noise gives the "stretch" near edges.
 *
 * Only honored in Chromium (url() on backdrop-filter); elsewhere the glass
 * utilities keep their plain blur (see index.css + glassSupport).
 */
export function GlassFilters() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: 'fixed', width: 0, height: 0, pointerEvents: 'none', opacity: 0 }}
    >
      <defs>
        <filter id="glass-refract" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.016" numOctaves={2} seed={7} stitchTiles="stitch" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="1.2" result="snoise" />

          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />

          <feDisplacementMap in="r" in2="snoise" scale="11" xChannelSelector="R" yChannelSelector="G" result="rd" />
          <feDisplacementMap in="g" in2="snoise" scale="7" xChannelSelector="R" yChannelSelector="G" result="gd" />
          <feDisplacementMap in="b" in2="snoise" scale="4" xChannelSelector="R" yChannelSelector="G" result="bd" />

          <feBlend in="rd" in2="gd" mode="screen" result="rg" />
          <feBlend in="rg" in2="bd" mode="screen" />
        </filter>

        <filter id="glass-refract-strong" x="-18%" y="-18%" width="136%" height="136%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.007 0.013" numOctaves={2} seed={4} stitchTiles="stitch" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="1.4" result="snoise" />

          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />

          <feDisplacementMap in="r" in2="snoise" scale="17" xChannelSelector="R" yChannelSelector="G" result="rd" />
          <feDisplacementMap in="g" in2="snoise" scale="11" xChannelSelector="R" yChannelSelector="G" result="gd" />
          <feDisplacementMap in="b" in2="snoise" scale="6" xChannelSelector="R" yChannelSelector="G" result="bd" />

          <feBlend in="rd" in2="gd" mode="screen" result="rg" />
          <feBlend in="rg" in2="bd" mode="screen" />
        </filter>
      </defs>
    </svg>
  );
}
