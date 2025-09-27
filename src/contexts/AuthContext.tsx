import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  retryAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as loading
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const navigate = useNavigate();

  const checkAuth = async () => {
    // Prevent multiple auth checks
    if (hasCheckedAuth) {
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        setUser(null);
        setIsLoading(false);
        setHasCheckedAuth(true);
        return;
      }

      setIsLoading(true);

      // Add timeout to prevent hanging on slow networks (especially mobile)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for mobile

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/user`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setHasCheckedAuth(true);
        } else if (response.status === 401) {
          // Token is invalid/expired - clear it
          console.log('Token invalid, clearing auth');
          localStorage.removeItem('access_token');
          setUser(null);
          setHasCheckedAuth(true);
        } else {
          // Other error (server error, network issue) - assume user is still authenticated
          // This prevents logout on temporary network issues, especially on mobile
          console.warn('Auth check failed with status:', response.status, '- assuming still authenticated');
          // Keep the existing user state or set to null but don't clear token
          setUser(null); // Show login screen but keep token for retry
          setHasCheckedAuth(true);
        }
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          console.warn('Auth check timed out - assuming still authenticated on mobile');
          // On mobile, timeouts are common - don't clear auth state
          // This prevents the annoying "please log in again" on page refresh
          setUser(null); // But show login to be safe
          setHasCheckedAuth(true);
        } else {
          console.error('Auth check network error:', error);
          // Network error - don't clear token, just set user to null
          setUser(null);
          setHasCheckedAuth(true);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setHasCheckedAuth(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      if (response.ok) {
        const data = await response.json();
        
        // Store JWT token
        localStorage.setItem('access_token', data.access_token);
        
        setUser(data.user);
        setHasCheckedAuth(true); // Mark as authenticated
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Login failed');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      console.error('Login error:', error);
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const response = await authAPI.signup(email, password);
      if (response.ok) {
        const data = await response.json();
        
        // Store JWT token
        localStorage.setItem('access_token', data.access_token);
        
        setUser(data.user);
        setHasCheckedAuth(true); // Mark as authenticated
        toast.success('Account created successfully!');
        navigate('/dashboard');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Signup failed');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      console.error('Signup error:', error);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      
      // Clear JWT token
      localStorage.removeItem('access_token');
      
      setUser(null);
      setHasCheckedAuth(false); // Reset auth check state
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user state and token even if logout fails
      localStorage.removeItem('access_token');
      setUser(null);
      setHasCheckedAuth(false);
      navigate('/login');
    }
  };

  // Manual retry function for when auth check fails
  const retryAuth = () => {
    setHasCheckedAuth(false);
    setIsLoading(true);
    checkAuth();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, checkAuth, retryAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}