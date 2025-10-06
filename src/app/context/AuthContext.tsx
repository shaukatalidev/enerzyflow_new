"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { authService } from "../services/authService";
import {
  profileService,
  ProfileResponse,
  SaveProfileRequest,
} from "../services/profileService";
import { AuthContextType, User, AuthTokens } from "../types/auth";
import { useRouter } from "next/navigation";

interface ExtendedUser extends User {
  profile?: ProfileResponse["user"];
  company?: ProfileResponse["company"];
  labels?: ProfileResponse["labels"];
}

interface AuthState {
  user: ExtendedUser | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  profileLoading: boolean;
  profileLoaded: boolean;
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_PROFILE_LOADING"; payload: boolean }
  | { type: "SET_PROFILE_LOADED"; payload: boolean }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; tokens: AuthTokens } }
  | { type: "UPDATE_PROFILE"; payload: ProfileResponse }
  | { type: "LOGOUT" };

const initialState: AuthState = {
  user: null,
  tokens: null,
  isLoading: true,
  isAuthenticated: false,
  profileLoading: false,
  profileLoaded: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_PROFILE_LOADING":
      return { ...state, profileLoading: action.payload };
    case "SET_PROFILE_LOADED":
      return { ...state, profileLoaded: action.payload };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        isLoading: false,
        profileLoaded: false,
      };
    case "UPDATE_PROFILE":
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              profile: action.payload.user,
              company: action.payload.company,
              labels: action.payload.labels,
            }
          : null,
        profileLoading: false,
        profileLoaded: true,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        profileLoading: false,
        profileLoaded: false,
      };
    default:
      return state;
  }
};

interface ExtendedAuthContextType extends AuthContextType {
  user: ExtendedUser | null;
  profileLoading: boolean;
  profileLoaded: boolean;
  loadProfile: (force?: boolean) => Promise<void>;
  updateProfile: (profileData: SaveProfileRequest) => Promise<void>;
  getUserLabelId: () => string | null;
  isProfileComplete: () => boolean;
  getPostLoginRedirectPath: () => string;
}

const AuthContext = createContext<ExtendedAuthContextType | undefined>(
  undefined
);

const hasValidValue = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (typeof value === "number") return !isNaN(value);
  if (typeof value === "boolean") return true;
  return false;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const profileLoadAttempted = useRef(false);
  const profileLoadingRef = useRef(false);
  const mountedRef = useRef(true);
  const loadProfileRef = useRef<
    ((force?: boolean) => Promise<void>) | undefined
  >(undefined);

  const router = useRouter();

  // ✅ Updated: Add admin and plant roles
  const isProfileComplete = useCallback(
    (user: ExtendedUser | null = state.user): boolean => {
      
      if (!user) {
        return false;
      }

      // ✅ Admin, printing, and plant roles don't need profile completion
      if (user.role === "admin" || user.role === "printing" || user.role === "plant") {
        return true;
      }

      const hasProfile = !!user.profile;
      const hasName = hasValidValue(user.profile?.name);
      const hasPhone = hasValidValue(user.profile?.phone);
      const hasDesignation = hasValidValue(user.profile?.designation);
      const hasCompany = !!user.company;
      const hasCompanyName = hasValidValue(user.company?.name);
      const hasCompanyAddress = hasValidValue(user.company?.address);

      if (!hasProfile || !hasName || !hasPhone || !hasDesignation || !hasCompany || !hasCompanyName || !hasCompanyAddress) {
        return false;
      }

      return true;
    },
    [state.user]
  );

  // ✅ Updated: Add admin and plant roles
  const getPostLoginRedirectPath = useCallback((): string => {
    
    // ✅ Admin, printing, and plant roles go directly to dashboard
    if (state.user?.role === "admin" || state.user?.role === "printing" || state.user?.role === "plant") {
      return "/dashboard";
    }

    const isComplete = isProfileComplete(state.user);
    const path = isComplete ? "/dashboard" : "/profile";
    return path;
  }, [state.user, isProfileComplete]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Backend logout error:', error);
    } finally {
      if (mountedRef.current) {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        profileLoadAttempted.current = false;
        profileLoadingRef.current = false;
        dispatch({ type: "LOGOUT" });
        
        router.replace('/');
      }
    }
  }, [router]);

  const loadProfile = useCallback(
    async (force: boolean = false): Promise<void> => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        return;
      }

      if (
        !force &&
        (profileLoadingRef.current || profileLoadAttempted.current)
      ) {
        return;
      }

      if (force) {
        profileLoadAttempted.current = false;
        profileLoadingRef.current = false;
      }

      profileLoadingRef.current = true;
      profileLoadAttempted.current = true;

      if (mountedRef.current) {
        dispatch({ type: "SET_PROFILE_LOADING", payload: true });
      }

      try {
        const profileData = await profileService.getProfile();

        if (!mountedRef.current) return;

        const profileResponse: ProfileResponse = {
          user: profileData.user,
          company: profileData.company,
          labels: profileData.labels || undefined,
        };

        dispatch({ type: "UPDATE_PROFILE", payload: profileResponse });

        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser: ExtendedUser = {
          ...currentUser,
          profile: profileData.user,
          company: profileData.company,
          labels: profileData.labels || undefined,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (err) {
        if (mountedRef.current) {
          dispatch({ type: "SET_PROFILE_LOADING", payload: false });
          profileLoadAttempted.current = false;
        }

        if (err instanceof Error && err.message.includes("401")) {
          logout();
        }
      } finally {
        if (mountedRef.current) {
          profileLoadingRef.current = false;
        }
      }
    },
    [logout]
  );

  loadProfileRef.current = loadProfile;

  useEffect(() => {
    const loadStoredAuth = async (): Promise<void> => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedAccessToken = localStorage.getItem("accessToken");

        if (storedUser && storedAccessToken) {
          const user: User = JSON.parse(storedUser);
          const tokens: AuthTokens = {
            accessToken: storedAccessToken,
          };

          dispatch({ type: "LOGIN_SUCCESS", payload: { user, tokens } });

          const extendedUser = user as ExtendedUser;
          if (extendedUser.profile && extendedUser.company) {
            dispatch({ type: "SET_PROFILE_LOADED", payload: true });
            profileLoadAttempted.current = true;
          }
        }
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        if (mountedRef.current) {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      }
    };

    loadStoredAuth();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ✅ Updated: Skip profile loading for admin, printing, and plant roles
  useEffect(() => {
    if (
      state.isAuthenticated &&
      state.user?.role !== "admin" && // ✅ Added
      state.user?.role !== "printing" && 
      state.user?.role !== "plant" && // ✅ Added
      !state.profileLoaded &&
      !state.user?.profile &&
      !profileLoadAttempted.current &&
      !profileLoadingRef.current
    ) {
      loadProfileRef.current?.();
    }
  }, [state.isAuthenticated, state.profileLoaded, state.user?.profile, state.user?.role]);

  const updateProfile = useCallback(
    async (profileData: SaveProfileRequest): Promise<void> => {
      dispatch({ type: "SET_PROFILE_LOADING", payload: true });
      try {
        const result = await profileService.saveProfile(profileData);

        const profileResponse: ProfileResponse = {
          user: result.user,
          company: result.company,
          labels: result.labels || undefined,
        };

        dispatch({ type: "UPDATE_PROFILE", payload: profileResponse });

        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser: ExtendedUser = {
          ...currentUser,
          profile: result.user,
          company: result.company,
          labels: result.labels || undefined,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (err) {
        dispatch({ type: "SET_PROFILE_LOADING", payload: false });
        throw err;
      }
    },
    []
  );

  const getUserLabelId = useCallback((): string | null => {
    if (state.user?.labels && state.user.labels.length > 0) {
      return state.user.labels[0].label_id || null;
    }
    return null;
  }, [state.user?.labels]);

  const sendOTP = useCallback(async (email: string): Promise<void> => {
    const sanitizedEmail = email.trim().toLowerCase();

    if (!sanitizedEmail) {
      throw new Error("Email is required");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
      throw new Error("Invalid email format");
    }

    try {
      await authService.sendOTP(sanitizedEmail);
    } catch (err) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: {
            status?: number;
            data?: { message?: string; error?: string };
          };
          message?: string;
        };

        if (axiosError.response?.data) {
          const msg =
            axiosError.response.data.message ||
            axiosError.response.data.error ||
            "Failed to send OTP";
          throw new Error(msg);
        }
      }

      throw err instanceof Error ? err : new Error("Failed to send OTP");
    }
  }, []);

  const login = useCallback(
    async (email: string, otp: string): Promise<void> => {
      const sanitizedEmail = email.trim().toLowerCase();
      const sanitizedOtp = otp.trim();

      if (!sanitizedEmail || !sanitizedOtp) {
        throw new Error("Email and OTP are required");
      }

      if (!/^\d{6}$/.test(sanitizedOtp)) {
        throw new Error("OTP must be 6 digits");
      }

      try {
        dispatch({ type: "SET_LOADING", payload: true });

        const response = await authService.verifyOTP(
          sanitizedEmail,
          sanitizedOtp
        );

        const user: User = response.user;
        const tokens: AuthTokens = {
          accessToken: response.accessToken,
        };

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.removeItem("refreshToken");

        dispatch({ type: "LOGIN_SUCCESS", payload: { user, tokens } });

        profileLoadAttempted.current = false;
        profileLoadingRef.current = false;

        // ✅ Only load profile for business_owner role
        if (user.role === "business_owner") {
          await loadProfile();
        }
      } catch (err) {
        dispatch({ type: "SET_LOADING", payload: false });

        if (err && typeof err === "object" && "response" in err) {
          const axiosError = err as {
            response?: {
              status?: number;
              data?: { message?: string; error?: string };
            };
          };

          if (
            axiosError.response?.status === 400 ||
            axiosError.response?.status === 401
          ) {
            throw new Error("Incorrect OTP. Please try again.");
          }

          if (axiosError.response?.data) {
            const backendError = axiosError.response.data;
            const errorMessage =
              backendError.message || backendError.error || "Login failed";
            throw new Error(errorMessage);
          }
        }

        throw err instanceof Error ? err : new Error("Login failed");
      }
    },
    [loadProfile]
  );

  const value: ExtendedAuthContextType = useMemo(
    () => ({
      user: state.user,
      tokens: state.tokens,
      isLoading: state.isLoading,
      isAuthenticated: state.isAuthenticated,
      profileLoading: state.profileLoading,
      profileLoaded: state.profileLoaded,
      login,
      sendOTP,
      logout,
      loadProfile,
      updateProfile,
      getUserLabelId,
      isProfileComplete: () => isProfileComplete(state.user),
      getPostLoginRedirectPath,
    }),
    [
      state.user,
      state.tokens,
      state.isLoading,
      state.isAuthenticated,
      state.profileLoading,
      state.profileLoaded,
      login,
      sendOTP,
      logout,
      loadProfile,
      updateProfile,
      getUserLabelId,
      isProfileComplete,
      getPostLoginRedirectPath,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): ExtendedAuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
