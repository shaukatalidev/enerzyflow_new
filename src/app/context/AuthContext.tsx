"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { authService } from "../services/authService";
import {
  profileService,
  ProfileResponse,
  SaveProfileRequest,
} from "../services/profileService";
import { AuthContextType, User, AuthTokens } from "../types/auth";

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
  loadProfile: () => Promise<void>;
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

  const isProfileComplete = useCallback(
    (user: ExtendedUser | null = state.user): boolean => {
      if (!user?.profile) return false;
      if (!hasValidValue(user.profile.name)) return false;
      if (!hasValidValue(user.profile.phone)) return false;
      if (!hasValidValue(user.profile.designation)) return false;
      if (!user.company) return false;
      if (!hasValidValue(user.company.name)) return false;
      if (!hasValidValue(user.company.address)) return false;
      return true;
    },
    [state.user]
  );

  const getPostLoginRedirectPath = useCallback((): string => {
    const isComplete = isProfileComplete(state.user);
    return isComplete ? "/dashboard" : "/profile";
  }, [state.user, isProfileComplete]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  const loadProfile = useCallback(async (): Promise<void> => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    dispatch({ type: "SET_PROFILE_LOADING", payload: true });

    try {
      const profileData = await profileService.getProfile();
      
      // ✅ Convert null to undefined for labels
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
    } catch (error) {
      console.error("❌ Failed to load profile:", error);
      dispatch({ type: "SET_PROFILE_LOADING", payload: false });
      if (error instanceof Error && error.message.includes("401")) {
        logout();
      }
    }
  }, [logout]);

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

          if ((user as ExtendedUser).profile) {
            dispatch({ type: "SET_PROFILE_LOADED", payload: true });
          }
        }
      } catch (error) {
        console.error("Error loading stored auth:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };
    loadStoredAuth();
  }, []);

  useEffect(() => {
    if (state.isAuthenticated && !state.profileLoaded && !state.user?.profile) {
      loadProfile();
    }
  }, [state.isAuthenticated, state.profileLoaded, state.user?.profile, loadProfile]);

  const updateProfile = useCallback(
    async (profileData: SaveProfileRequest): Promise<void> => {
      dispatch({ type: "SET_PROFILE_LOADING", payload: true });
      try {
        const result = await profileService.saveProfile(profileData);
        
        // ✅ Convert null to undefined for labels
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
      } catch (error) {
        dispatch({ type: "SET_PROFILE_LOADING", payload: false });
        throw error;
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
    try {
      await authService.sendOTP(email);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || "Failed to send OTP");
      }
      if (typeof error === "object" && error !== null && "response" in error) {
        const apiError = error as { response?: { data?: { error?: string } } };
        throw new Error(apiError.response?.data?.error || "Failed to send OTP");
      }
      throw new Error("Failed to send OTP");
    }
  }, []);

  const login = useCallback(
    async (email: string, otp: string): Promise<void> => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const response = await authService.verifyOTP(email, otp);
        const user: User = response.user;
        
        const tokens: AuthTokens = {
          accessToken: response.accessToken,
        };

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.removeItem("refreshToken");

        dispatch({ type: "LOGIN_SUCCESS", payload: { user, tokens } });

        await loadProfile();
      } catch (error) {
        dispatch({ type: "SET_LOADING", payload: false });
        if (error instanceof Error) {
          throw new Error(error.message || "Login failed");
        }
        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error
        ) {
          const apiError = error as {
            response?: { data?: { error?: string } };
          };
          throw new Error(apiError.response?.data?.error || "Login failed");
        }
        throw new Error("Login failed");
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
