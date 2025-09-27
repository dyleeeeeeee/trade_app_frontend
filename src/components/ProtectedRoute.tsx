import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading, retryAuth } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-dark">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If user is null but we finished loading, show an error with retry option
  if (user === null && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-dark px-4">
        <div className="w-full max-w-md space-y-4">
          <Alert className="border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Unable to verify your account. This may be due to a network issue.
            </AlertDescription>
          </Alert>
          <div className="flex gap-2">
            <Button
              onClick={retryAuth}
              className="flex-1 bg-primary hover:bg-primary/80"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/login'}
              className="flex-1"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check admin requirement
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}