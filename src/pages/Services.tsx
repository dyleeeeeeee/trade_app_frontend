import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CandlestickChart, PieChart, Copy, ShieldCheck, Check } from 'lucide-react';

import { MarketingLayout } from '@/components/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const SERVICES = [
  {
    icon: CandlestickChart,
    title: 'Crypto trading',
    body:
      'Trade dozens of cryptocurrencies with live prices and the tools you need, whether you are just starting or trading every day.',
    points: ['Live market data', 'Many trading pairs', 'Detailed charts', 'Trade from your phone'],
  },
  {
    icon: PieChart,
    title: 'Portfolio management',
    body:
      'Work with advisers on a plan built around your goals, with regular reviews to keep your portfolio on track.',
    points: ['A plan built around you', 'Risk assessment', 'Regular rebalancing', 'Performance tracking'],
  },
  {
    icon: Copy,
    title: 'Copy trading',
    body:
      'Follow experienced traders and mirror their moves automatically. Learn as you go and stay in control of your own account.',
    points: ['Follow proven traders', 'Mirror trades automatically', 'Performance analytics', 'Risk controls'],
  },
  {
    icon: ShieldCheck,
    title: 'Security and compliance',
    body: 'Strong security and full regulatory compliance keep your funds protected.',
    points: ['Multi-signature wallets', 'Cold storage', 'KYC and AML checks', 'Round-the-clock monitoring'],
  },
];

export default function Services() {
  const reduce = useReducedMotion();

  const reveal = {
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  };

  return (
    <MarketingLayout>
      {/* Hero */}
      <motion.section
        className="flex flex-col items-center gap-6 py-12 text-center sm:py-20 lg:py-28"
        initial={{ opacity: 0, y: reduce ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
      >
        <span className="text-caption uppercase text-text-tertiary">What we offer</span>
        <h1 className="max-w-3xl text-balance text-display">Services</h1>
        <p className="max-w-2xl text-balance text-body text-text-secondary">
          Everything you need to trade crypto and manage your money, in one place.
        </p>
      </motion.section>

      {/* Service cards */}
      <motion.section className="grid grid-cols-1 gap-5 py-8 sm:gap-6 sm:py-12 md:grid-cols-2" {...reveal}>
        {SERVICES.map(({ icon: Icon, title, body, points }) => (
          <Card key={title} interactive className="flex flex-col gap-5 p-5 sm:p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-interactive/10">
              <Icon className="h-5 w-5 text-interactive" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-2">
              <h2 className="text-h3 text-text-primary">{title}</h2>
              <p className="text-body-sm text-text-secondary">{body}</p>
            </div>
            <ul className="mt-1 flex flex-col gap-3">
              {points.map((point) => (
                <li key={point} className="flex items-center gap-3 text-body-sm text-text-secondary">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-feedback-success/15">
                    <Check className="h-3 w-3 text-feedback-success" strokeWidth={2} aria-hidden="true" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </motion.section>

      {/* CTA */}
      <motion.section className="py-12 sm:py-12 lg:py-20" {...reveal}>
        <Card className="relative overflow-hidden p-6 text-center sm:p-8 lg:p-12">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-primary opacity-[0.10] blur-3xl"
            aria-hidden="true"
          />
          <div className="relative mx-auto flex max-w-xl flex-col items-center gap-6">
            <h2 className="text-balance text-h1 text-text-primary">Ready to begin?</h2>
            <p className="text-body text-text-secondary">
              Open an account in minutes and start trading with tools and guidance built for you.
            </p>
            <Button asChild variant="primary" size="lg">
              <Link to="/signup">
                Get started
                <ArrowRight className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </Card>
      </motion.section>
    </MarketingLayout>
  );
}
