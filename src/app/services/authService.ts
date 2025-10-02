import axiosInstance from '../lib/axios';
import { AuthResponse } from '../types/auth';

export const authService = {
  sendOTP: async (email: string): Promise<{ message: string }> => {
    const response = await axiosInstance.post<{ message: string }>('/auth/send-otp', {
      email,
    });
    return response.data;
  },

  verifyOTP: async (email: string, otp: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/verify-otp', {
      email,
      otp,
    });
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await axiosInstance.post<{ accessToken: string }>('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },

  logout: async (): Promise<void> => {
    // Since there's no backend logout endpoint, just clear local storage
    try {
      // Clear all auth-related items from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Also clear any legacy auth tokens if they exist
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      
    } catch (error) {
      console.error('Error during logout cleanup:', error);
      // Even if there's an error, we should still clear what we can
      try {
        localStorage.clear(); // Clear everything as fallback
      } catch (clearError) {
        console.error('Failed to clear localStorage:', clearError);
      }
    }
  },
};
