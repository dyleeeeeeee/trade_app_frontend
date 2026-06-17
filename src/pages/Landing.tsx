import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Menu,
  X,
  LineChart,
  ShieldCheck,
  Sparkles,
  Check,
} from 'lucide-react';

import { usePrices } from '@/hooks/use-prices';
import { LivePrice, PriceChange } from '@/components/LivePrice';
import { AssetLogo } from '@/components/AssetLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const NAV_LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
];

export default function Landing() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduce = useReducedMotion();

  const { data: prices } = usePrices();
  const bySymbol = (s: string) => prices?.find((p) => p.symbol === s);
  const featured = [bySymbol('BTC/USD'), bySymbol('ETH/USD'), bySymbol('NVDA')].filter(Boolean);

  // One reveal definition, reused — purposeful, reduced-motion aware.
  const reveal = {
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  };

  return (
    <div id="top" className="min-h-screen text-text-primary">
      {/* ---- Floating glass pill nav ---- */}
      <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <nav
          className="glass flex h-14 w-full max-w-[940px] items-center justify-between gap-2 rounded-full pl-4 pr-2 shadow-elevation-3"
          aria-label="Primary"
        >
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/main-logo.png" alt="" className="h-6 w-auto" aria-hidden="true" />
            <span className="text-body-sm font-semibold tracking-tight">Astrid Global</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) =>
              link.to ? (
                <Link
                  key={link.label}
                  to={link.to}
                  className="rounded-full px-3.5 py-1.5 text-body-sm font-medium text-text-secondary transition-colors duration-micro hover:bg-white/[0.06] hover:text-text-primary"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-full px-3.5 py-1.5 text-body-sm font-medium text-text-secondary transition-colors duration-micro hover:bg-white/[0.06] hover:text-text-primary"
                >
                  {link.label}
                </a>
              ),
            )}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild variant="primary" size="sm">
              <Link to="/signup">Get started</Link>
            </Button>
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-white/[0.06] hover:text-text-primary md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
          </button>
        </nav>
      </header>

      {/* Mobile menu — floating glass sheet under the pill */}
      {mobileOpen && (
        <div className="fixed inset-x-4 top-20 z-50 md:hidden">
          <div className="glass-strong flex flex-col gap-1 rounded-2xl p-3 shadow-elevation-4">
            {NAV_LINKS.map((link) =>
              link.to ? (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-3 text-body-sm font-medium text-text-secondary hover:bg-white/[0.06] hover:text-text-primary"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-3 text-body-sm font-medium text-text-secondary hover:bg-white/[0.06] hover:text-text-primary"
                >
                  {link.label}
                </a>
              ),
            )}
            <div className="mt-2 flex gap-2 border-t border-white/[0.08] pt-3">
              <Button asChild variant="secondary" size="md" className="flex-1">
                <Link to="/login" onClick={() => setMobileOpen(false)}>Log in</Link>
              </Button>
              <Button asChild variant="primary" size="md" className="flex-1">
                <Link to="/signup" onClick={() => setMobileOpen(false)}>Get started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-[1200px] px-6 pt-28 lg:px-8">
        {/* ---- Hero ---- */}
        <section className="grid grid-cols-1 items-center gap-12 py-20 lg:grid-cols-2 lg:gap-16 lg:py-32">
          <motion.div
            className="order-2 flex flex-col gap-8 lg:order-1"
            initial={{ opacity: 0, y: reduce ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
          >
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1 text-caption uppercase text-text-secondary backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 text-interactive" strokeWidth={1.5} aria-hidden="true" />
              Professional crypto trading platform
            </span>

            <h1 className="text-balance text-[2.75rem] font-bold leading-[1.05] tracking-tight md:text-6xl">
              Expert crypto &amp;
              <br />
              <span className="bg-gradient-to-r from-brand-300 to-interactive bg-clip-text text-transparent">
                wealth management
              </span>
            </h1>

            <p className="max-w-xl text-body text-text-secondary">
              Comprehensive crypto and wealth management — secure investment opportunities and
              expert guidance, engineered for your financial growth.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="primary" size="lg">
                <Link to="/signup">
                  Start investing
                  <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link to="/login">Sign in</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, scale: reduce ? 1 : 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0, 0, 0.2, 1], delay: 0.1 }}
          >
            <div className="relative mx-auto max-w-md lg:mx-0">
              <div
                className="absolute -inset-6 rounded-[2rem] bg-gradient-primary opacity-[0.12] blur-2xl"
                aria-hidden="true"
              />
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-hairline/[0.08] shadow-elevation-3">
                <img
                  src="/images/banner-image.png"
                  alt="Astrid Global trading platform"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* ---- Trust strip ---- */}
        <motion.section className="border-t border-hairline/[0.08] py-12" {...reveal}>
          <p className="mb-8 text-center text-caption uppercase text-text-tertiary">
            Trusted by industry leaders
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <img
                key={i}
                src={`/images/association-brand${i}.png`}
                alt={`Partner ${i}`}
                className="h-8 w-auto opacity-40 grayscale transition-opacity duration-interaction hover:opacity-80 lg:h-9"
              />
            ))}
          </div>
        </motion.section>

        {/* ---- Live markets ---- */}
        <motion.section className="py-20" {...reveal}>
          <div className="mb-12 flex flex-col items-center gap-3 text-center">
            <span className="flex items-center gap-2 text-caption uppercase text-text-tertiary">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-feedback-success opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-feedback-success" />
              </span>
              Real-time pricing
            </span>
            <h2 className="text-balance text-h1">Premier market offerings</h2>
            <p className="max-w-xl text-body text-text-secondary">
              A curated selection of top-performing assets with live pricing and instant trading.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(featured.length > 0 ? featured : [null, null, null]).map((asset: any, i: number) => (
              <Card key={asset?.symbol ?? i} interactive className="p-6">
                {asset ? (
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                      <AssetLogo symbol={asset.symbol} size={44} />
                      <div className="min-w-0">
                        <p className="truncate text-body font-semibold">{asset.name}</p>
                        <p className="text-caption uppercase text-text-tertiary">{asset.symbol}</p>
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <LivePrice value={Number(asset.price)} className="font-mono text-h2 font-semibold" />
                      <PriceChange changePercent={asset.changePercent} />
                    </div>
                    <Button asChild variant="secondary" size="md" className="w-full">
                      <Link to="/trading">
                        Trade {asset.symbol.replace('/USD', '')}
                        <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 animate-pulse rounded-full bg-surface-overlay" />
                      <div className="flex flex-col gap-2">
                        <div className="h-4 w-24 animate-pulse rounded bg-surface-overlay" />
                        <div className="h-3 w-12 animate-pulse rounded bg-surface-overlay" />
                      </div>
                    </div>
                    <div className="h-8 w-32 animate-pulse rounded bg-surface-overlay" />
                    <div className="h-10 w-full animate-pulse rounded-lg bg-surface-overlay" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </motion.section>

        {/* ---- Feature: portfolio tracking ---- */}
        <motion.section className="grid grid-cols-1 items-center gap-12 border-t border-hairline/[0.08] py-20 lg:grid-cols-2 lg:gap-16" {...reveal}>
          <div className="overflow-hidden rounded-2xl border border-hairline/[0.08] shadow-elevation-2">
            <img src="/images/single-image1.png" alt="Portfolio tracking dashboard" className="w-full" />
          </div>
          <div className="flex flex-col gap-5">
            <span className="flex w-fit items-center gap-2 rounded-lg bg-interactive/10 px-3 py-1.5 text-caption uppercase text-interactive">
              <LineChart className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              Portfolio
            </span>
            <h2 className="text-balance text-h1">Advanced portfolio tracking</h2>
            <p className="text-body text-text-secondary">
              Monitor every position, analyze performance, and optimize your strategy from one
              calm, comprehensive surface — built for long-term financial success.
            </p>
            <ul className="flex flex-col gap-3">
              {['Real-time position monitoring', 'Performance analytics', 'Strategy optimization'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-body-sm text-text-secondary">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-feedback-success/15">
                    <Check className="h-3 w-3 text-feedback-success" strokeWidth={2} aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* ---- Feature: security ---- */}
        <motion.section className="grid grid-cols-1 items-center gap-12 border-t border-hairline/[0.08] py-20 lg:grid-cols-2 lg:gap-16" {...reveal}>
          <div className="order-2 flex flex-col gap-5 lg:order-1">
            <span className="flex w-fit items-center gap-2 rounded-lg bg-interactive/10 px-3 py-1.5 text-caption uppercase text-interactive">
              <ShieldCheck className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              Security
            </span>
            <h2 className="text-balance text-h1">Secure wealth management</h2>
            <p className="text-body text-text-secondary">
              Robust security measures protect your investments while keeping your portfolio
              within reach. Safeguard your assets and build your wealth with confidence.
            </p>
            <ul className="flex flex-col gap-3">
              {['Institutional-grade custody', 'Encrypted, audited infrastructure', 'KYC & compliance built in'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-body-sm text-text-secondary">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-feedback-success/15">
                    <Check className="h-3 w-3 text-feedback-success" strokeWidth={2} aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="order-1 overflow-hidden rounded-2xl border border-hairline/[0.08] shadow-elevation-2 lg:order-2">
            <img src="/images/single-image2.png" alt="Security infrastructure" className="w-full" />
          </div>
        </motion.section>

        {/* ---- Subscribe ---- */}
        <motion.section className="py-20" {...reveal}>
          <Card className="relative overflow-hidden p-8 lg:p-12">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-primary opacity-[0.10] blur-3xl" aria-hidden="true" />
            <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
              <h2 className="text-balance text-h1">Insights, straight to your inbox</h2>
              <p className="text-body text-text-secondary">
                Exclusive market analysis and wealth-management tips from our expert team. Join a
                community of informed investors.
              </p>
              <form
                className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
                onSubmit={(e) => e.preventDefault()}
              >
                <label htmlFor="subscribe-email" className="sr-only">Email address</label>
                <Input id="subscribe-email" type="email" placeholder="you@example.com" className="h-12 flex-1" />
                <Button type="submit" variant="primary" size="lg">Subscribe</Button>
              </form>
            </div>
          </Card>
        </motion.section>
      </main>

      {/* ---- Footer ---- */}
      <footer className="border-t border-hairline/[0.08]">
        <div className="mx-auto max-w-[1200px] px-6 py-16 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-2">
              <img src="/images/main-logo.png" alt="Astrid Global Ltd" className="h-8 w-auto" />
              <p className="mt-4 max-w-sm text-body-sm text-text-secondary">
                Your trusted partner in crypto and wealth management — combining innovative
                cryptocurrency services with professional expertise.
              </p>
            </div>
            <FooterCol title="About" links={[{ label: 'About us', to: '/about' }, { label: 'Services', to: '/services' }]} />
            <FooterCol title="Company" links={[{ label: 'Security', to: '/security' }]} />
            <FooterCol title="Support" links={[{ label: 'Contact us', to: '/contact' }]} />
          </div>
          <div className="mt-12 border-t border-hairline/[0.08] pt-8 text-center text-caption text-text-tertiary">
            © 2026 Astrid Global Ltd. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h4 className="text-caption uppercase text-text-tertiary">{title}</h4>
      <ul className="mt-4 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.to} className="text-body-sm text-text-secondary transition-colors hover:text-interactive">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
