import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

import { LiquidGlass } from '@/components/LiquidGlass';
import { Button } from '@/components/ui/button';
import { LivePrice, PriceChange } from '@/components/LivePrice';

/**
 * GlassDemo (/glass-demo) — a stage to show the backdrop refraction. A moving
 * gradient and a tall column of large typography scroll *behind* a sticky
 * glass panel, so the background bleeds under its curved edges and visibly
 * warps with RGB fringing (Chromium). Toggle the effect to compare against the
 * plain blur fallback.
 */
export default function GlassDemo() {
  const [on, setOn] = useState(true);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    // The capability gate ran at app start; reflect its decision here.
    const root = document.documentElement;
    setSupported(root.classList.contains('glass-refract-on'));
    setOn(root.classList.contains('glass-refract-on'));
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = !root.classList.contains('glass-refract-on');
    root.classList.toggle('glass-refract-on', next);
    setOn(next);
  };

  const bigRows = ['LIQUID', 'GLASS', '$64,128.40', 'REFRACTION', 'iOS', '+2.41%', 'ASTRID', 'CRYSTAL', '$1,902.77', 'LENS'];

  return (
    <div className="relative min-h-[320vh] overflow-x-hidden bg-surface-base">
      {/* Moving gradient graphic — fixed, always in motion */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute h-[60vmax] w-[60vmax] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, hsl(210 100% 55% / 0.5), transparent 60%)' }}
          animate={{ x: ['-10%', '40%', '-10%'], y: ['0%', '50%', '0%'] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-0 h-[55vmax] w-[55vmax] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, hsl(280 90% 60% / 0.45), transparent 60%)' }}
          animate={{ x: ['10%', '-30%', '10%'], y: ['20%', '60%', '20%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 h-[50vmax] w-[50vmax] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, hsl(150 80% 50% / 0.4), transparent 60%)' }}
          animate={{ x: ['30%', '-10%', '30%'], y: ['-10%', '20%', '-10%'] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Tall column of big typography that scrolls under the panel edges */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center gap-[14vh] pt-[30vh]">
        {bigRows.map((t, i) => (
          <span
            key={i}
            className="select-none bg-gradient-to-r from-white/90 to-interactive/80 bg-clip-text font-mono text-[14vw] font-bold leading-none tracking-tighter text-transparent"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Controls */}
      <div className="fixed inset-x-0 top-4 z-50 flex items-center justify-between px-6">
        <Button asChild variant="secondary" size="sm">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> Back
          </Link>
        </Button>
        <div className="liquid-glass flex items-center gap-3 rounded-full px-4 py-2">
          <span className="text-caption text-text-secondary">
            {supported ? 'Refraction supported' : 'Chromium-only — fallback blur here'}
          </span>
          <button
            onClick={toggle}
            className="rounded-full bg-interactive-solid px-3 py-1 text-caption font-semibold text-interactive-foreground"
          >
            {on ? 'Effect: On' : 'Effect: Off'}
          </button>
        </div>
      </div>

      {/* Sticky glass panel — background bleeds under its edges */}
      <div className="sticky top-[32vh] z-10 flex justify-center px-6">
        <LiquidGlass strong className="w-full max-w-md p-8">
          <p className="text-caption uppercase text-text-tertiary">Live · Bitcoin</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <LivePrice value={64128.4} flash={false} className="font-mono text-display text-text-primary" />
            <PriceChange changePercent={2.41} />
          </div>
          <div className="my-6 h-px bg-white/[0.1]" />
          <p className="text-body text-text-secondary">
            Scroll the page — the type and gradients passing under this panel's curved edge warp
            and split into faint RGB fringing, like a thick crystal lens. Toggle the effect to
            compare with the plain blur.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="glass-inset rounded-xl p-3">
              <p className="text-caption text-text-tertiary">Edge displacement</p>
              <p className="font-mono text-body-sm font-semibold text-text-primary">feDisplacementMap</p>
            </div>
            <div className="glass-inset rounded-xl p-3">
              <p className="text-caption text-text-tertiary">Fringing</p>
              <p className="font-mono text-body-sm font-semibold text-text-primary">RGB split</p>
            </div>
          </div>
        </LiquidGlass>
      </div>

      <div className="relative z-10 flex h-[40vh] items-end justify-center pb-12">
        <p className="text-body-sm text-text-tertiary">Keep scrolling — the lens stays put while the world moves beneath it.</p>
      </div>
    </div>
  );
}
