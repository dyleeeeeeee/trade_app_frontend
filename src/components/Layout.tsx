import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  Wallet,
  TrendingUp,
  Users,
  LogOut,
  Shield,
  Layers,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

/** Hide the floating nav when scrolling down, reveal when scrolling up. */
function useScrollDirection() {
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) setHidden(false);
      else if (y > last.current + 6) setHidden(true);
      else if (y < last.current - 6) setHidden(false);
      last.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return hidden;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const reduce = useReducedMotion();
  const hidden = useScrollDirection();

  const navItems = useMemo(() => {
    const items = [
      { path: '/dashboard', label: 'Dashboard', icon: Home },
      { path: '/wallet', label: 'Wallet', icon: Wallet },
      { path: '/trading', label: 'Trading', icon: TrendingUp },
      { path: '/copy-trading', label: 'Copy', icon: Users },
      { path: '/strategies', label: 'Strategies', icon: Layers },
      { path: '/kyc', label: 'KYC', icon: Shield },
    ];
    if (user?.role === 'admin') items.push({ path: '/admin', label: 'Admin', icon: Shield });
    return items;
  }, [user?.role]);

  const initials = user?.email?.[0]?.toUpperCase() ?? 'A';

  const NavItem = ({ item }: { item: (typeof navItems)[number] }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'group relative flex items-center gap-2 rounded-full px-3 py-2',
          'transition-[background-color,color,box-shadow,transform] duration-interaction ease-standard',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive/70 focus-visible:ring-offset-0',
          'active:scale-95',
          isActive
            ? 'bg-interactive/15 text-interactive shadow-[0_0_20px_hsl(var(--interactive-default)/0.25)]'
            : 'text-text-secondary hover:bg-white/[0.06] hover:text-text-primary',
        )}
      >
        <Icon className="h-5 w-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
        {/* Label: always on desktop; on mobile only the active tab (morph). */}
        <span
          className={cn(
            'whitespace-nowrap text-body-sm font-medium',
            isActive ? 'inline' : 'hidden md:inline',
          )}
        >
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen">
      {/* ---- Top floating glass pill (desktop) ---- */}
      <motion.header
        className="fixed inset-x-0 top-4 z-50 hidden justify-center px-6 md:flex"
        initial={false}
        animate={{ y: hidden && !reduce ? -120 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav
          className="glass flex h-14 items-center gap-1 rounded-full px-2 shadow-elevation-3"
          aria-label="Primary"
        >
          <Link to="/dashboard" className="flex items-center gap-2 px-3" aria-label="Astrid Global home">
            <img src="/images/main-logo.png" alt="" className="h-6 w-auto" aria-hidden="true" />
          </Link>
          <span className="mx-1 h-6 w-px bg-white/[0.08]" aria-hidden="true" />
          {navItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
          <span className="mx-1 h-6 w-px bg-white/[0.08]" aria-hidden="true" />
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full bg-interactive/15 text-caption font-semibold text-interactive"
            title={user?.email}
            aria-hidden="true"
          >
            {initials}
          </span>
          <button
            onClick={logout}
            aria-label="Log out"
            className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-white/[0.06] hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive/70"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </nav>
      </motion.header>

      {/* ---- Bottom floating glass pill (mobile) ---- */}
      <motion.nav
        className="fixed inset-x-4 bottom-4 z-50 flex md:hidden"
        aria-label="Primary"
        initial={false}
        animate={{ y: hidden && !reduce ? 120 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="glass flex w-full items-center justify-around gap-0.5 rounded-full px-1.5 py-1.5 shadow-elevation-3">
          {navItems.slice(0, 5).map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
          <button
            onClick={logout}
            aria-label="Log out"
            className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors active:scale-95 hover:bg-white/[0.06]"
          >
            <LogOut className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </motion.nav>

      {/* ---- Content ---- */}
      <main className="mx-auto max-w-[1200px] px-6 pb-28 pt-24 md:px-8 md:pb-12">{children}</main>
    </div>
  );
}
