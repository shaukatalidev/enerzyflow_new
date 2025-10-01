import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// ✅ This request interceptor is correct and remains unchanged.
// It attaches your accessToken to every protected API call.
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      // Only add the token for requests that are not to the auth endpoints
      if (token && !config.url?.includes('/auth/')) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// 🚩 Corrected Response Interceptor
// This now handles session expiry by logging the user out,
// since there is no refreshToken to use.
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    // Check if the error is a 401 Unauthorized
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        console.error("Unauthorized session. Logging out.");
        
        // Clear all session data from localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken'); // In case old values exist
        localStorage.removeItem('user');
        
        // Redirect to the login page
        // We avoid using Next.js router here to prevent component state issues
        window.location.href = '/login';
      }
    }

    // For all other errors, just reject the promise
    return Promise.reject(error);
  }
);


export default axiosInstance;