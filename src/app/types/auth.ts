export interface User {
  user_id: string;
  email: string;
  name?: string;
  phone?: string;
  designation?: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  user: User;
}

export interface SendOTPRequest {
  email: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, otp: string) => Promise<void>;
  sendOTP: (email: string) => Promise<void>;
  logout: () => void;
}
