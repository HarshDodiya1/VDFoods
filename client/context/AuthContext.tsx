"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import ApiService, {
  User,
  LoginCredentials,
  RegisterData,
  OtpData,
  ResetPasswordData,
} from "../utils/api";
import { toast } from "react-hot-toast";

interface AuthResult {
  success: boolean;
  data?: any;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (userData: RegisterData) => Promise<AuthResult>;
  logout: () => void;
  handleTokenExpiry: () => void;
  sendOtp: (email: string) => Promise<AuthResult>;
  verifyOtp: (otpData: OtpData) => Promise<AuthResult>;
  resetPassword: (resetData: ResetPasswordData) => Promise<AuthResult>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if user is logged in on app load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          const parsedUser: User = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      setLoading(true);
      const response = await ApiService.login(credentials);

      // Store token and user data
      if (typeof window !== "undefined" && response.token && response.user) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      setUser(response.user || null);
      setIsAuthenticated(true);

      toast.success("Login successful!");
      return { success: true, data: response };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<AuthResult> => {
    try {
      setLoading(true);
      const response = await ApiService.register(userData);

      toast.success("Registration successful! Now you can login.");
      return { success: true, data: response };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Logged out successfully!");
  };

  const handleTokenExpiry = (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    setUser(null);
    setIsAuthenticated(false);
    toast.error("Session expired. Please login again.");
  };

  const sendOtp = async (email: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      const response = await ApiService.sendOtp(email);
      toast.success("OTP sent to your email!");
      return { success: true, data: response };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send OTP";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otpData: OtpData): Promise<AuthResult> => {
    try {
      setLoading(true);
      const response = await ApiService.verifyOtp(otpData);
      toast.success("OTP verified successfully!");
      return { success: true, data: response };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "OTP verification failed";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (
    resetData: ResetPasswordData
  ): Promise<AuthResult> => {
    try {
      setLoading(true);
      const response = await ApiService.resetPassword(resetData);
      toast.success("Password reset successfully!");
      return { success: true, data: response };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Password reset failed";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    handleTokenExpiry,
    sendOtp,
    verifyOtp,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
