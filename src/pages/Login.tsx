import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2, Mail, Lock } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const reduce = useReducedMotion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, password);
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
        <Card className="liquid-glass p-6 sm:p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <img src="/images/main-logo.png" alt="Astrid Global Ltd" className="h-12 w-auto" />
            <h1 className="text-h2">Welcome back</h1>
            <p className="text-body-sm text-text-secondary">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                icon={Mail}
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-body-sm text-interactive transition-colors hover:text-interactive-hover">
                  Forgot password?
                </Link>
              </div>
              <Input
                icon={Lock}
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </Button>

            <p className="text-center text-body-sm text-text-secondary">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-interactive transition-colors hover:text-interactive-hover">
                Sign up
              </Link>
            </p>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
