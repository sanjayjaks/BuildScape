import axios, { AxiosInstance } from 'axios';
import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User, 
  UpdateProfileData,
  ResetPasswordData,
  NewPasswordData,
  RefreshTokenResponse
} from './types';

class AuthService {
  private api: AxiosInstance;
  private refreshTokenTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for authentication
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await this.refreshToken(refreshToken);
            this.setToken(response.token);
            this.setRefreshToken(response.refreshToken);

            originalRequest.headers.Authorization = `Bearer ${response.token}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            this.logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Token Management
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  public getAuthToken(): string | null {
    return this.getToken();
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem('refreshToken', token);
  }

  private clearTokens(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  // Authentication Methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', credentials);
    const { token, refreshToken, user } = response.data;

    this.setToken(token);
    this.setRefreshToken(refreshToken);
    this.startRefreshTokenTimer();

    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', data);
    const { token, refreshToken, user } = response.data;

    this.setToken(token);
    this.setRefreshToken(refreshToken);
    this.startRefreshTokenTimer();

    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } finally {
      this.clearTokens();
      this.stopRefreshTokenTimer();
    }
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await this.api.post<RefreshTokenResponse>('/auth/refresh-token', { refreshToken });
    return response.data;
  }

  async forgotPassword(data: ResetPasswordData): Promise<void> {
    await this.api.post('/auth/forgot-password', data);
  }

  async resetPassword(data: NewPasswordData): Promise<void> {
    await this.api.post('/auth/reset-password', data);
  }

  async verifyEmail(token: string): Promise<void> {
    await this.api.post('/auth/verify-email', { token });
  }

  async resendVerificationEmail(email: string): Promise<void> {
    await this.api.post('/auth/resend-verification', { email });
  }

  // User Profile Methods
  async getCurrentUser(): Promise<User> {
    const response = await this.api.get<User>('/auth/me');
    return response.data;
  }

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await this.api.put<User>('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updatePreferences(preferences: User['preferences']): Promise<User> {
    const response = await this.api.put<User>('/auth/preferences', { preferences });
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  // Token Refresh Timer
  private startRefreshTokenTimer(): void {
    const token = this.getToken();
    if (!token) return;

    const jwtToken = JSON.parse(atob(token.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - 60 * 1000; // Refresh 1 minute before expiry

    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshToken(this.getRefreshToken()!).catch(() => {
        this.logout();
      });
    }, timeout);
  }

  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
      this.refreshTokenTimeout = null;
    }
  }

  // Social Authentication
  async loginWithGoogle(token: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/google', { token });
    const { token: authToken, refreshToken, user } = response.data;

    this.setToken(authToken);
    this.setRefreshToken(refreshToken);
    this.startRefreshTokenTimer();

    return response.data;
  }

  async loginWithFacebook(token: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/facebook', { token });
    const { token: authToken, refreshToken, user } = response.data;

    this.setToken(authToken);
    this.setRefreshToken(refreshToken);
    this.startRefreshTokenTimer();

    return response.data;
  }

  // Session Management
  async getActiveSessions(): Promise<Array<{ id: string; device: string; lastActive: string }>> {
    const response = await this.api.get('/auth/sessions');
    return response.data;
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.api.delete(`/auth/sessions/${sessionId}`);
  }

  async revokeAllSessions(): Promise<void> {
    await this.api.delete('/auth/sessions');
  }
}

export const authService = new AuthService(); 