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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setUser(null);
        return;
      }

      const response = await authAPI.getCurrentUser();
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Clear invalid token
        localStorage.removeItem('access_token');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('access_token');
      setUser(null);
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
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user state and token even if logout fails
      localStorage.removeItem('access_token');
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, checkAuth }}>
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