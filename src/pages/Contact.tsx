import { motion, useReducedMotion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

import { MarketingLayout } from '@/components/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const DETAILS = [
  { icon: Mail, label: 'Email', value: 'support@astridglobal.com' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
  {
    icon: MapPin,
    label: 'Address',
    value: (
      <>
        123 Financial District
        <br />
        New York, NY 10001
        <br />
        United States
      </>
    ),
  },
  {
    icon: Clock,
    label: 'Business hours',
    value: (
      <>
        Monday - Friday: 9:00 AM - 6:00 PM EST
        <br />
        Saturday: 10:00 AM - 4:00 PM EST
        <br />
        Sunday: Closed
      </>
    ),
  },
];

export default function Contact() {
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
        <span className="text-caption uppercase text-text-tertiary">Get in touch</span>
        <h1 className="max-w-3xl text-balance text-display">Contact us</h1>
        <p className="max-w-2xl text-balance text-body text-text-secondary">
          Have a question about trading or your account? Our team is here to help.
        </p>
      </motion.section>

      {/* Contact grid */}
      <motion.section className="grid grid-cols-1 gap-6 py-8 sm:py-12 lg:grid-cols-2 lg:py-20" {...reveal}>
        {/* Details */}
        <Card className="flex flex-col gap-6 p-5 sm:p-6">
          <h2 className="text-h3 text-text-primary">Get in touch</h2>
          <div className="flex flex-col gap-6">
            {DETAILS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-interactive/10">
                  <Icon className="h-5 w-5 text-interactive" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="text-caption uppercase text-text-tertiary">{label}</p>
                  <p className="break-words text-body-sm text-text-secondary">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Form */}
        <Card className="flex flex-col gap-6 p-5 sm:p-6">
          <h2 className="text-h3 text-text-primary">Send a message</h2>
          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input id="contact-name" type="text" placeholder="Your name" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input id="contact-email" type="email" placeholder="you@example.com" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-subject">Subject</Label>
              <Input id="contact-subject" type="text" placeholder="Subject" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea id="contact-message" rows={5} placeholder="How can we help?" />
            </div>
            <Button type="submit" variant="primary" size="lg" className="w-full">
              Send message
            </Button>
          </form>
        </Card>
      </motion.section>
    </MarketingLayout>
  );
}
