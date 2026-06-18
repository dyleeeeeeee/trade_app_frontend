import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
];

/**
 * MarketingLayout — shared shell for public pages (About/Services/Contact/
 * Security). Floating glass pill nav + glass footer, matching the home page
 * and in-app Liquid Glass language. The page background and ambient glow come
 * from the global body styles, so this stays transparent.
 */
export function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen text-text-primary">
      {/* Floating glass pill nav */}
      <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <nav
          className="liquid-glass flex h-14 w-full max-w-[940px] items-center justify-between gap-2 rounded-full pl-4 pr-2 shadow-elevation-3"
          aria-label="Primary"
        >
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/main-logo.png" alt="" className="h-6 w-auto" aria-hidden="true" />
            <span className="text-body-sm font-semibold tracking-tight">Astrid Global</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="rounded-full px-3.5 py-1.5 text-body-sm font-medium text-text-secondary transition-colors duration-micro hover:bg-white/[0.06] hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
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

      {mobileOpen && (
        <div className="fixed inset-x-4 top-20 z-50 md:hidden">
          <div className="glass-strong flex flex-col gap-1 rounded-2xl p-3 shadow-elevation-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-3 py-3 text-body-sm font-medium text-text-secondary hover:bg-white/[0.06] hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
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

      <main className="mx-auto max-w-[1200px] px-6 pt-28 lg:px-8">{children}</main>

      {/* Glass footer */}
      <footer className="mt-12 border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-6 py-12 text-center lg:px-8">
          <img src="/images/main-logo.png" alt="Astrid Global Ltd" className="h-8 w-auto" />
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {[...NAV_LINKS, { label: 'Security', to: '/security' }].map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-body-sm text-text-secondary transition-colors hover:text-interactive"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-caption text-text-tertiary">© 2026 Astrid Global Ltd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
