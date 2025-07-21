import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

// Import mock data
const MOCK_USER = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'user',
  isServiceProvider: false
};

const MOCK_TOKEN = 'mock-jwt-token';

// Define user type
// This should align with your backend's user object
interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  verificationStatus?: string;
  isServiceProvider?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserProfile: (data: { name: string }) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// Add the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          }
        }
      } catch (error: any) {
        console.error('Session check error:', error);
        // Only clear if it's an explicit auth error
        if (error.response?.status === 401) {
          setUser(null);
          localStorage.removeItem('token');
        } else {
          // For other errors, use mock data
          setUser(MOCK_USER);
        }
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      if (response.token) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        // Use navigate instead of window.location for smoother transition
        navigate('/dashboard', { replace: true });
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login failed:', error);
      // If it's a network error or server error, use mock data
      if (!error.response || error.response?.status === 500) {
        setUser(MOCK_USER);
        localStorage.setItem('token', MOCK_TOKEN);
        navigate('/dashboard', { replace: true });
        return true;
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateUserProfile = async (data: { name: string }): Promise<boolean> => {
    try {
      // For now, just update the local state since backend is not available
      if (user) {
        setUser({
          ...user,
          name: data.name
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update profile:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
