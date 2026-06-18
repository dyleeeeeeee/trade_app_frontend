import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2, Lock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { motion, useReducedMotion } from 'framer-motion';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const tooShort = password.length > 0 && password.length < 8;
  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const res = await authAPI.resetPassword(token, password);
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success('Your password has been reset. You can now sign in.');
        navigate('/login');
      } else {
        toast.error(data?.message || 'This reset link is invalid or has expired.');
      }
    } catch {
      toast.error('Check your connection and try again');
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
        <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] bg-gradient-primary opacity-[0.12] blur-3xl" aria-hidden="true" />
        <Card className="liquid-glass p-6 sm:p-8">
          {!token ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-feedback-error/30 bg-feedback-error/10">
                <AlertTriangle className="h-7 w-7 text-feedback-error" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h1 className="text-h2">Invalid reset link</h1>
              <p className="text-body-sm text-text-secondary">
                This link is missing its security token. Request a new one to reset your password.
              </p>
              <Button asChild variant="primary" size="md" className="mt-2">
                <Link to="/forgot-password">Request a new link</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-3 text-center">
                <img src="/images/main-logo.png" alt="Astrid Global Ltd" className="h-12 w-auto" />
                <h1 className="text-h2">Set a new password</h1>
                <p className="text-body-sm text-text-secondary">Choose a strong password you don't use elsewhere.</p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password">New password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      aria-invalid={tooShort}
                      className="pl-10"
                    />
                  </div>
                  {tooShort && <p className="text-caption text-feedback-error">Use at least 8 characters.</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <div className="relative">
                    <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
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

                <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading || tooShort || mismatch}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Resetting…
                    </>
                  ) : (
                    'Reset password'
                  )}
                </Button>

                <p className="text-center text-body-sm text-text-secondary">
                  Remembered it?{' '}
                  <Link to="/login" className="font-medium text-interactive transition-colors hover:text-interactive-hover">
                    Sign in
                  </Link>
                </p>
              </form>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
