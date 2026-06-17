import { motion, useReducedMotion } from 'framer-motion';
import { Lock, Scale, Eye, Umbrella, Check } from 'lucide-react';

import { MarketingLayout } from '@/components/MarketingLayout';
import { Card } from '@/components/ui/card';

const PILLARS = [
  {
    icon: Lock,
    title: 'Layered security',
    body:
      'We protect your assets with encryption, multi-signature wallets, and cold storage, so no single point of failure can put your funds at risk.',
    points: ['End-to-end encryption', 'Multi-signature wallets', '95% of assets in cold storage', 'Two-factor authentication'],
  },
  {
    icon: Scale,
    title: 'Regulatory compliance',
    body:
      'We work with licensed financial institutions and follow international financial regulations, including KYC and AML requirements.',
    points: ['KYC and AML compliance', 'Licensed and regulated', 'Regular independent audits', 'Transparent reporting'],
  },
  {
    icon: Eye,
    title: 'Round-the-clock monitoring',
    body:
      'Our security team watches the platform 24/7. Automated threat detection flags unusual activity so we can act before it affects you.',
    points: ['Real-time threat detection', 'Automated alerts', 'Incident response team', 'Regular penetration testing'],
  },
  {
    icon: Umbrella,
    title: 'Insurance coverage',
    body:
      'Your crypto assets are backed by insurance that covers digital asset loss and cyber liability, for added protection beyond our own safeguards.',
    points: ['Digital asset insurance', 'Cyber liability coverage', 'Fidelity bond protection', 'SOC 2 Type II compliance'],
  },
];

const STATS = [
  { value: '$0', label: 'Security breaches' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Security monitoring' },
  { value: '100%', label: 'Regulatory compliant' },
];

export default function Security() {
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
        className="flex flex-col items-center gap-6 py-20 text-center lg:py-28"
        initial={{ opacity: 0, y: reduce ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
      >
        <span className="text-caption uppercase text-text-tertiary">Security and compliance</span>
        <h1 className="max-w-3xl text-balance text-display">Built to protect what you earn.</h1>
        <p className="max-w-2xl text-balance text-body text-text-secondary">
          We protect your funds and personal information with strong encryption, independent
          audits, and regulatory compliance. Here&apos;s how.
        </p>
      </motion.section>

      {/* Pillars */}
      <motion.section className="grid grid-cols-1 gap-6 py-12 md:grid-cols-2" {...reveal}>
        {PILLARS.map(({ icon: Icon, title, body, points }) => (
          <Card key={title} interactive className="flex flex-col gap-5 p-8">
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

      {/* Commitment + stats */}
      <motion.section className="py-12 lg:py-20" {...reveal}>
        <Card className="relative overflow-hidden p-8 text-center lg:p-12">
          <div
            className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-gradient-primary opacity-[0.10] blur-3xl"
            aria-hidden="true"
          />
          <div className="relative flex flex-col items-center gap-6">
            <h2 className="text-balance text-h1 text-text-primary">Our security commitment</h2>
            <p className="max-w-2xl text-body text-text-secondary">
              We hold ourselves to high standards of security and compliance across crypto and
              wealth management. We invest in current security technology and undergo independent
              audits to keep your assets protected.
            </p>
            <div className="mt-4 grid w-full grid-cols-2 gap-6 md:grid-cols-4">
              {STATS.map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <p className="text-h2 font-semibold text-interactive">{value}</p>
                  <p className="text-body-sm text-text-secondary">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.section>
    </MarketingLayout>
  );
}
