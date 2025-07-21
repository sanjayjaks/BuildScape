import api from './api';

// BuildScape Authentication Service

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
  userType: 'regular' | 'serviceProvider';
}

interface AuthResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isServiceProvider: boolean;
  };
  token: string;
}

// Mock user for development when backend is not available
const MOCK_USER = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'user',
  isServiceProvider: false
};

const MOCK_TOKEN = 'mock-jwt-token';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Attempting login with:', credentials.email);
      console.log('API URL:', api.defaults.baseURL);
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        console.log('Token received, storing in localStorage');
        localStorage.setItem('token', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        console.log('Authorization header set:', api.defaults.headers.common['Authorization']);
      }
      return response.data;
    } catch (error: any) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to login. Please check your credentials and try again.');
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to register. Please try again later.');
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  },

  async getCurrentUser(): Promise<AuthResponse['user']> {
    try {
      const response = await api.get<{ user: AuthResponse['user'] }>('/auth/me');
      return response.data.user;
    } catch (error: any) {
      console.error('Get current user error:', error);
      
      // If it's a network error, 500 error, or backend is not available, use mock data
      if (!error.response || error.response?.status === 500) {
        console.log('Using mock user data due to server error');
        return MOCK_USER;
      }
      
      // For actual authentication errors, throw the error
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      
      // For other errors, use mock data
      console.log('Using mock user data due to error');
      return MOCK_USER;
    }
  },

  async verifyEmail(token: string): Promise<void> {
    try {
      await api.post('/auth/verify-email', { token });
    } catch (error: any) {
      console.error('Email verification error:', error.response?.data || error.message);
      throw new Error('Failed to verify email. Please try again later.');
    }
  },

  async requestPasswordReset(email: string): Promise<void> {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error: any) {
      console.error('Password reset request error:', error.response?.data || error.message);
      throw new Error('Failed to request password reset. Please try again later.');
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post('/auth/reset-password', { token, newPassword });
    } catch (error: any) {
      console.error('Password reset error:', error.response?.data || error.message);
      throw new Error('Failed to reset password. Please try again later.');
    }
  },

  // Initialize auth state from localStorage
  initializeAuth(): void {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
}; 