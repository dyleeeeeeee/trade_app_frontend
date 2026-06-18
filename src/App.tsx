import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Suspense, lazy, Component, ReactNode } from "react";

// Error boundary component
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Page loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="flex max-w-md flex-col items-center text-center">
            <div
              className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-feedback-error/30 bg-feedback-error/10"
              aria-hidden="true"
            >
              <AlertTriangle className="h-8 w-8 text-feedback-error" strokeWidth={1.5} />
            </div>
            <h2 className="text-h2 text-text-primary">Something went wrong</h2>
            <p className="mt-3 text-balance text-body text-text-secondary">
              We hit an error loading this page. Refreshing usually clears it.
            </p>
            <Button variant="primary" size="md" className="mt-8" onClick={() => window.location.reload()}>
              Refresh page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Eager load critical components
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Lazy load less critical components
const Wallet = lazy(() => import("./pages/Wallet"));
const Trading = lazy(() => import("./pages/Trading"));
const CopyTrading = lazy(() => import("./pages/CopyTrading"));
const Admin = lazy(() => import("./pages/Admin"));
const KYC = lazy(() => import("./pages/KYC"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Contact = lazy(() => import("./pages/Contact"));
const Security = lazy(() => import("./pages/Security"));
const Strategies = lazy(() => import("./pages/Strategies"));


// Fluid loading spinner with advanced animations
// Calm, deferent loading state — a single ring, no theatrics.
const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Loading">
    <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-interactive" aria-hidden="true" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ErrorBoundary>
            <PageTransition>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/security" element={<Security />} />
                  <Route path="/kyc" element={
                    <ProtectedRoute>
                      <KYC />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/wallet" element={
                    <ProtectedRoute>
                      <Wallet />
                    </ProtectedRoute>
                  } />
                  <Route path="/strategies" element={
                    <ProtectedRoute>
                      <Strategies />
                    </ProtectedRoute>
                  } />
                  <Route path="/trading" element={
                    <ProtectedRoute>
                      <Trading />
                    </ProtectedRoute>
                  } />
                  <Route path="/copy-trading" element={
                    <ProtectedRoute>
                      <CopyTrading />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute requireAdmin>
                      <Admin />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </PageTransition>
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
