import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { authAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2, ArrowLeft, MailCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const reduce = useReducedMotion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authAPI.forgotPassword(email);
      if (response.ok) {
        setIsSubmitted(true);
        toast.success('Reset link sent. Check your inbox.');
      } else {
        toast.error('We couldn\'t send the reset link. Try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: reduce ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
      >
        <div
          className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] bg-gradient-primary opacity-[0.12] blur-3xl"
          aria-hidden="true"
        />
        <Card className="liquid-glass p-6 sm:p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <img src="/images/main-logo.png" alt="Astrid Global Ltd" className="h-12 w-auto" />
            <h2 className="text-h2">Reset your password</h2>
            <p className="text-body-sm text-text-secondary">
              {isSubmitted
                ? 'Check your inbox for the reset link.'
                : 'Enter your email and we\'ll send you a link to reset your password.'}
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending…
                  </>
                ) : (
                  'Send reset link'
                )}
              </Button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-body-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                Back to login
              </Link>
            </form>
          ) : (
            <div className="mt-8 flex flex-col items-center gap-6 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-feedback-success/15">
                <MailCheck className="h-6 w-6 text-feedback-success" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <p className="break-words text-body-sm text-text-secondary">
                If an account exists for {email}, we&apos;ve sent a reset link. Check your inbox.
              </p>
              <Button asChild variant="primary" size="lg" className="w-full">
                <Link to="/login">Back to login</Link>
              </Button>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
