import { ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  isVerified?: boolean;
  address?: Address;
  createdAt?: string;
  updatedAt?: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface OtpData {
  email: string;
  otp: string;
}

export interface ResetPasswordData {
  email: string;
  newPassword: string;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  token?: string;
  user?: User;
}

export interface AuthResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface NavItem {
  name: string;
  link: string;
  icon: ReactNode;
}

export interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface Slide {
  image: string;
}

export interface Stat {
  label: string;
  color: string;
}

// Backend response types (to match your backend structure)
export interface BackendUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  isVerified: boolean;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
  };
}

export interface RegisterResponse {
  message: string;
}

export interface OtpResponse {
  message: string;
}

export interface VerifyOtpResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}
