import axiosInstance from '../lib/axios';
import { AuthResponse } from '../types/auth';

// ✅ Constants for auth storage keys
const AUTH_STORAGE_KEYS = {
  USER: 'user',
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  AUTH_TOKEN: 'authToken',
  USER_EMAIL: 'userEmail',
} as const;

interface SendOTPResponse {
  message: string;
}

interface RefreshTokenResponse {
  accessToken: string;
}

// ✅ Optimized as class for consistency with adminService
class AuthService {
  // ==================== Authentication Methods ====================

  /**
   * Send OTP to email
   * POST /auth/send-otp
   */
  async sendOTP(email: string): Promise<SendOTPResponse> {
    try {
      const response = await axiosInstance.post<SendOTPResponse>('/auth/send-otp', {
        email,
      });
      return response.data;
    } catch (error) {
      console.error('❌ Failed to send OTP:', error);
      throw this.handleError(error, 'Failed to send OTP');
    }
  }

  /**
   * Verify OTP and authenticate user
   * POST /auth/verify-otp
   */
  async verifyOTP(email: string, otp: string): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>('/auth/verify-otp', {
        email,
        otp,
      });
      return response.data;
    } catch (error) {
      console.error('❌ Failed to verify OTP:', error);
      throw this.handleError(error, 'Failed to verify OTP');
    }
  }

  /**
   * Refresh access token
   * POST /auth/refresh
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const response = await axiosInstance.post<RefreshTokenResponse>('/auth/refresh', {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      console.error('❌ Failed to refresh token:', error);
      throw this.handleError(error, 'Failed to refresh token');
    }
  }

  /**
   * Logout user and clear all authentication data
   */
  async logout(): Promise<void> {
    try {
      // Clear all auth-related items from localStorage
      this.clearAuthStorage();
    } catch (error) {
      console.error('❌ Error during logout cleanup:', error);
      // Even if there's an error, we should still clear what we can
      this.fallbackClearStorage();
    }
  }

  // ==================== Storage Management ====================

  /**
   * Clear all authentication data from localStorage
   */
  private clearAuthStorage(): void {
    Object.values(AUTH_STORAGE_KEYS).forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Failed to remove ${key} from localStorage:`, error);
      }
    });
  }

  /**
   * Fallback: clear entire localStorage if individual removal fails
   */
  private fallbackClearStorage(): void {
    try {
      localStorage.clear();
    } catch (clearError) {
      console.error('❌ Failed to clear localStorage:', clearError);
    }
  }

  /**
   * Save authentication data to localStorage
   */
  saveAuthData(user: unknown, accessToken: string, refreshToken?: string): void {
    try {
      localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      if (refreshToken) {
        localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
    } catch (error) {
      console.error('❌ Failed to save auth data:', error);
      throw new Error('Failed to save authentication data');
    }
  }

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    try {
      return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('❌ Failed to get access token:', error);
      return null;
    }
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('❌ Failed to get refresh token:', error);
      return null;
    }
  }

  /**
   * Get stored user data
   */
  getStoredUser<T = unknown>(): T | null {
    try {
      const userData = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('❌ Failed to get stored user:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // ==================== Helper Methods ====================

  /**
   * Handle API errors consistently (same as adminService)
   */
  private handleError(error: unknown, defaultMessage: string): Error {
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'data' in error.response
    ) {
      const data = error.response.data as { error?: string; message?: string };

      if (data.error) {
        return new Error(data.error);
      }
      if (data.message) {
        return new Error(data.message);
      }
    }

    if (error instanceof Error) {
      return new Error(error.message);
    }

    return new Error(defaultMessage);
  }

  /**
   * Validate email format (same as adminService)
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate OTP format
   */
  validateOTP(otp: string): boolean {
    return /^\d{6}$/.test(otp);
  }

  /**
   * Sanitize email (trim and lowercase)
   */
  sanitizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}

// ✅ Export singleton instance (consistent with adminService)
export const authService = new AuthService();
export default authService;

// ✅ Export constants for use in other files
export { AUTH_STORAGE_KEYS };
