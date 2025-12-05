import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Loader2, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border-border shadow-2xl">
          <motion.div variants={itemVariants}>
            <CardHeader className="text-center pb-2">
              <motion.div
                className="flex justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200
                }}
              >
                <img src="/images/main-logo.png" alt="Astrid Global Ltd" className="h-12 w-auto" />
              </motion.div>
              <CardTitle className="text-2xl md:text-3xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Welcome back
              </CardTitle>
              <CardDescription className="text-sm md:text-base">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background/50 pl-11 focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background/50 pl-11 focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 transition-colors btn-animated inline-block"
                >
                  Forgot password?
                </Link>
              </motion.div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-6 pt-4">
              <motion.div variants={itemVariants} className="w-full">
                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:shadow-glow btn-animated text-base py-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      className="flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </motion.div>
                  ) : (
                    <motion.span
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Sign In
                    </motion.span>
                  )}
                </Button>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-sm text-muted-foreground text-center"
              >
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-primary hover:text-primary/80 transition-colors btn-animated font-medium"
                >
                  Sign up
                </Link>
              </motion.p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}