import { LOGIN_URL, ME, LOGOUT_URL, CHANGE_PASSWORD_URL } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  admin?: User;
  message?: string;
}

// API call helper with credentials for cookies
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    credentials: 'include', // Important for cookies
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(endpoint, config);
  return response;
};

// Auth API functions
export const authAPI = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiCall(LOGIN_URL, {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          admin: data.admin,
          message: data.message,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Login failed',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiCall(ME, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        return data.admin;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await apiCall(LOGOUT_URL, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async changePassword(data: ChangePasswordData): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiCall(CHANGE_PASSWORD_URL, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: result.message || 'Password changed successfully',
        };
      } else {
        return {
          success: false,
          message: result.message || 'Failed to change password',
        };
      }
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  },
};
