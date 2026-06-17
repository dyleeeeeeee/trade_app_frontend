import { motion, useReducedMotion } from 'framer-motion';
import { Award, ShieldCheck, Sparkles } from 'lucide-react';

import { MarketingLayout } from '@/components/MarketingLayout';
import { Card } from '@/components/ui/card';

const VALUES = [
  {
    icon: Award,
    title: 'Expertise',
    body: 'Decades of combined experience across finance and crypto markets.',
  },
  {
    icon: ShieldCheck,
    title: 'Security',
    body: 'Strong protections keep your funds and data safe.',
  },
  {
    icon: Sparkles,
    title: 'Innovation',
    body: 'Modern technology built for how people invest today.',
  },
];

export default function About() {
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
        <span className="text-caption uppercase text-text-tertiary">About Astrid Global</span>
        <h1 className="max-w-3xl text-balance text-display">
          Serious investing, made simple.
        </h1>
        <p className="max-w-2xl text-balance text-body text-text-secondary">
          We help people trade and manage crypto with confidence. Astrid Global pairs a
          straightforward trading platform with professional advice you can trust.
        </p>
      </motion.section>

      {/* Mission & vision */}
      <motion.section className="grid grid-cols-1 gap-6 py-12 md:grid-cols-2" {...reveal}>
        <Card className="p-8">
          <h2 className="text-h3 text-text-primary">Our mission</h2>
          <p className="mt-3 text-body text-text-secondary">
            Make serious investing simple. We bring trading tools and professional advice
            together in one place, so good strategies are within reach for everyone.
          </p>
        </Card>
        <Card className="p-8">
          <h2 className="text-h3 text-text-primary">Our vision</h2>
          <p className="mt-3 text-body text-text-secondary">
            A platform where traditional wealth management and crypto work as one, giving you
            clear ways to grow and protect what you earn.
          </p>
        </Card>
      </motion.section>

      {/* Values */}
      <motion.section className="py-12 lg:py-20" {...reveal}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, body }) => (
            <Card key={title} interactive className="flex flex-col gap-4 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-interactive/10">
                <Icon className="h-5 w-5 text-interactive" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="text-h3 text-text-primary">{title}</h3>
              <p className="text-body-sm text-text-secondary">{body}</p>
            </Card>
          ))}
        </div>
      </motion.section>
    </MarketingLayout>
  );
}
