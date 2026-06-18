import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2, Mail, Lock, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { motion, useReducedMotion } from 'framer-motion';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const reduce = useReducedMotion();

  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    await signup(email, password);
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: reduce ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
      >
        <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] bg-gradient-primary opacity-[0.12] blur-3xl" aria-hidden="true" />
        <Card className="liquid-glass p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <img src="/images/main-logo.png" alt="Astrid Global Ltd" className="h-12 w-auto" />
            <h1 className="text-h2">Create your account</h1>
            <p className="text-body-sm text-text-secondary">Start your investment journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <div className="relative">
                <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  aria-invalid={mismatch}
                  className="pl-10"
                />
              </div>
              {mismatch && <p className="text-caption text-feedback-error">Passwords don't match.</p>}
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading || mismatch}>
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating account…
                </>
              ) : (
                'Create account'
              )}
            </Button>

            <p className="text-center text-body-sm text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-interactive transition-colors hover:text-interactive-hover">
                Sign in
              </Link>
            </p>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
