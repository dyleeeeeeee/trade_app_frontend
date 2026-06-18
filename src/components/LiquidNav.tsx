import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Wallet, TrendingUp, Users, LogOut, Shield, Layers } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, useReducedMotion, type PanInfo } from 'framer-motion';

/** Hide the floating chrome on scroll-down, reveal on scroll-up. */
function useScrollHidden() {
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) setHidden(false);
      else if (y > last.current + 8) setHidden(true);
      else if (y < last.current - 8) setHidden(false);
      last.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return [hidden, setHidden] as const;
}

function useIsDesktop() {
  const [d, setD] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const on = () => setD(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return d;
}

/** Specular highlight that tracks the pointer under the glass. */
function useLiquidPointer() {
  const ref = useRef<HTMLDivElement>(null);
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

export function LiquidNav() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();
  const [hidden, setHidden] = useScrollHidden();
  const liquid = useLiquidPointer();

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
  const spring = reduce ? { duration: 0 } : { type: 'spring' as const, stiffness: 380, damping: 34 };
  const indicatorSpring = reduce ? { duration: 0 } : { type: 'spring' as const, stiffness: 520, damping: 36 };

  // Gestures: horizontal swipe switches tabs, swipe-down hides the bar.
  const onPanEnd = (_: unknown, info: PanInfo) => {
    const { offset } = info;
    if (Math.abs(offset.x) > 56 && Math.abs(offset.x) > Math.abs(offset.y)) {
      const dir = offset.x < 0 ? 1 : -1;
      const i = navItems.findIndex((n) => n.path === location.pathname);
      const next = navItems[Math.min(Math.max((i < 0 ? 0 : i) + dir, 0), navItems.length - 1)];
      if (next && next.path !== location.pathname) navigate(next.path);
    } else if (offset.y > 70) {
      setHidden(true);
    }
  };

  return (
    <>
      {/* Brand pill — top-left */}
      <motion.div
        className="fixed left-4 top-4 z-50 md:left-6"
        initial={false}
        animate={{ y: hidden ? -120 : 0, opacity: hidden ? 0 : 1 }}
        transition={spring}
      >
        <Link
          to="/dashboard"
          aria-label="Astrid Global — dashboard"
          className="liquid-glass flex h-12 items-center gap-2 rounded-full pl-2 pr-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive/70 sm:pr-4"
        >
          <img src="/images/main-logo.png" alt="" className="h-8 w-auto" aria-hidden="true" />
          <span className="hidden text-body-sm font-semibold tracking-tight text-text-primary sm:inline">Astrid</span>
        </Link>
      </motion.div>

      {/* User pill — top-right */}
      <motion.div
        className="fixed right-4 top-4 z-50 md:right-6"
        initial={false}
        animate={{ y: hidden ? -120 : 0, opacity: hidden ? 0 : 1 }}
        transition={spring}
      >
        <div className="liquid-glass flex h-12 items-center gap-2 rounded-full px-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full bg-interactive/20 text-caption font-semibold text-interactive"
            title={user?.email}
            aria-hidden="true"
          >
            {initials}
          </span>
          <span className="hidden max-w-[160px] truncate text-body-sm text-text-secondary lg:inline">{user?.email}</span>
          {user?.role === 'admin' && (
            <span className="hidden rounded-full bg-interactive/15 px-2 py-0.5 text-caption font-medium text-interactive lg:inline">
              Admin
            </span>
          )}
          <button
            onClick={logout}
            aria-label="Log out"
            className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-white/[0.10] hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive/70 active:scale-95"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </motion.div>

      {/* Bottom floating nav pill — gesture-driven, the primary navigation */}
      <motion.div
        className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4"
        initial={false}
        animate={{ y: hidden ? 140 : 0, opacity: hidden ? 0 : 1 }}
        transition={spring}
      >
        <motion.nav
          ref={liquid.ref}
          onPointerMove={liquid.onPointerMove}
          onPointerLeave={liquid.onPointerLeave}
          onPanEnd={onPanEnd}
          aria-label="Primary"
          className="liquid-glass pointer-events-auto flex max-w-[calc(100vw-2rem)] items-center gap-0.5 rounded-full p-1.5 touch-pan-y"
          style={{ ['--l-op' as string]: '0.4' }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            // Icon-only on mobile (predictable width that always fits); the
            // morphing indicator marks the active tab. Labels on desktop.
            const showLabel = isDesktop;
            return (
              <motion.div key={item.path} layout={!reduce} transition={spring} className="relative shrink-0">
                <Link
                  to={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={item.label}
                  className={cn(
                    'relative flex min-h-11 items-center justify-center gap-2 rounded-full px-3.5 py-2.5',
                    'transition-colors duration-micro',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive/70',
                    'active:scale-95',
                    isActive ? 'text-interactive' : 'text-text-secondary hover:text-text-primary',
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="navActive"
                      transition={indicatorSpring}
                      className="absolute inset-0 -z-10 rounded-full bg-interactive/18 shadow-[0_0_28px_hsl(var(--interactive-default)/0.40)] ring-1 ring-inset ring-interactive/30"
                      aria-hidden="true"
                    />
                  )}
                  <Icon className="relative h-5 w-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  {showLabel && (
                    <span
                      className={cn(
                        'relative whitespace-nowrap text-body-sm',
                        isActive ? 'font-semibold' : 'font-medium',
                      )}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>
      </motion.div>
    </>
  );
}
