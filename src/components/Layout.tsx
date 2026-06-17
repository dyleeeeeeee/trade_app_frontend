import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Home,
  Wallet,
  TrendingUp,
  Users,
  LogOut,
  Shield,
  Layers,
  Menu,
  X,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const reduce = useReducedMotion();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = useMemo(() => {
    const baseItems = [
      { path: '/dashboard', label: 'Dashboard', icon: Home },
      { path: '/wallet', label: 'Wallet', icon: Wallet },
      { path: '/trading', label: 'Trading', icon: TrendingUp },
      { path: '/copy-trading', label: 'Copy Trading', icon: Users },
      { path: '/strategies', label: 'Strategies', icon: Layers },
      { path: '/kyc', label: 'KYC', icon: Shield },
    ];

    if (user?.role === 'admin') {
      baseItems.push({ path: '/admin', label: 'Admin', icon: Shield });
    }

    return baseItems;
  }, [user?.role]);

  const initials = user?.email?.[0]?.toUpperCase() ?? 'A';

  return (
    <div className="min-h-screen">
      {/* Topbar — glass, sticky. Level-1 shadow signals layering above content. */}
      <header className="glass sticky top-0 z-50 border-b border-hairline/[0.08] shadow-elevation-1">
        <nav className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-8" aria-label="Primary">
          {/* Brand + desktop nav */}
          <div className="flex items-center gap-8">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
            >
              <img src="/images/main-logo.png" alt="" className="h-7 w-auto" aria-hidden="true" />
              <span className="text-body font-semibold tracking-tight text-text-primary">Astrid Global</span>
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'relative flex h-11 items-center gap-2 rounded-lg px-3 text-body-sm font-medium',
                      'transition-[color,background-color] duration-micro ease-standard',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base',
                      'active:scale-[0.98]',
                      isActive
                        ? 'bg-interactive/10 text-interactive'
                        : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary',
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-interactive" aria-hidden="true" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User cluster */}
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 md:flex">
              <div className="flex items-center gap-2">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-interactive/15 text-caption font-semibold text-interactive"
                  aria-hidden="true"
                >
                  {initials}
                </span>
                <span className="max-w-[180px] truncate text-body-sm text-text-secondary">{user?.email}</span>
                {user?.role === 'admin' && (
                  <span className="rounded-full bg-interactive/15 px-2 py-0.5 text-caption font-medium text-interactive">
                    Admin
                  </span>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                Logout
              </Button>
            </div>

            {/* Mobile toggle — 44px touch target */}
            <button
              className="flex h-11 w-11 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base md:hidden"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: reduce ? 0 : 0.24, ease: [0, 0, 0.2, 1] }}
              className="overflow-hidden border-t border-hairline/[0.08] glass-strong md:hidden"
            >
              <div className="space-y-1 px-6 py-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'flex h-11 items-center gap-3 rounded-lg px-3 text-body-sm font-medium transition-colors duration-micro',
                        isActive
                          ? 'bg-interactive/10 text-interactive'
                          : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary',
                      )}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                <div className="mt-3 flex items-center justify-between border-t border-hairline/[0.08] pt-4">
                  <span className="max-w-[200px] truncate text-body-sm text-text-secondary">{user?.email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                    Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main content — 1200px max, 32px outer margin (48px wide) */}
      <main className="mx-auto max-w-[1200px] px-8 py-8">{children}</main>
    </div>
  );
}
