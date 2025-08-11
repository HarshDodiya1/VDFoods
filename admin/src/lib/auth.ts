// import { cookies } from 'next/headers';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

// Client-side token management
export const tokenManager = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminToken', token);
      // Also set a cookie for server-side access
      document.cookie = `adminToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
    }
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminToken');
    }
    return null;
  },

  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      document.cookie = 'adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  },

  isAuthenticated: (): boolean => {
    return !!tokenManager.getToken();
  }
};

// Server-side token validation
export const getServerToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get('adminToken')?.value || null;
};

// API call helper with auth header
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = tokenManager.getToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${endpoint}`, config);
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  
  return response.json();
};

// Auth API functions
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (data.success && data.token) {
        tokenManager.setToken(data.token);
      }
      
      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  },

  logout: async (): Promise<void> => {
    tokenManager.removeToken();
    // Optionally call logout endpoint on server
    try {
      await apiCall('/api/admin/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
  },

  verifyToken: async (): Promise<AuthResponse> => {
    try {
      const data = await apiCall('/api/admin/verify');
      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Token verification failed',
      };
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await authAPI.verifyToken();
      return response.success ? response.user || null : null;
    } catch (error) {
      return null;
    }
  }
};
