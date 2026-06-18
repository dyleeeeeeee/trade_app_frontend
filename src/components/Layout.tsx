import { LiquidNav } from '@/components/LiquidNav';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * App shell — a chrome-less, fully-floating Liquid Glass layout: brand and
 * user pills float at the top, a gesture-driven nav pill floats at the bottom,
 * and content scrolls beneath. Padding clears the floating chrome.
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <LiquidNav />
      <main className="mx-auto max-w-[1200px] px-6 pb-32 pt-24 md:px-8">{children}</main>
    </div>
  );
}
