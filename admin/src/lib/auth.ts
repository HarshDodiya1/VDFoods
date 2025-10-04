import { LOGIN_URL, ME, LOGOUT_URL, CHANGE_PASSWORD_URL, PRODUCTS_URL, PRODUCT_BY_ID_URL, PRODUCTS_BY_CATEGORY_URL, CREATE_PRODUCT_URL } from './api';

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

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: string; // Changed to string to support "₹299" format
  oldPrice?: string; // Changed from originalPrice
  image: string; // Main product image
  images: string[]; // Additional images
  category: string; // Changed to string enum instead of object
  badge?: string;
  rating: number;
  reviews: number;
  tags: string[];
  weight?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  title: string; // Changed from name
  description: string;
  price: string; // Changed to string
  oldPrice?: string; // Changed from originalPrice
  image: string; // Main product image
  images?: string[]; // Additional images
  category: string; // Changed to string enum
  badge?: string;
  rating?: number;
  reviews?: number;
  tags?: string[];
  weight?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export interface ProductsResponse {
  message: string;
  data: {
    products: Product[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalProducts: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface ProductResponse {
  message: string;
  data: Product;
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
  const defaultHeaders: any = {
    'Content-Type': 'application/json',
  };

  // Add Authorization header if token exists in localStorage (fallback)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken');
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }
  }

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
        // Store token in localStorage as fallback
        if (data.token && typeof window !== 'undefined') {
          localStorage.setItem('adminToken', data.token);
        }
        
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
      
      // Clear token from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear localStorage even if API call fails
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
      }
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

// Product API functions
export const productAPI = {
  async getAllProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    tags?: string[];
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ProductsResponse> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              searchParams.append(key, value.join(','));
            } else {
              searchParams.append(key, value.toString());
            }
          }
        });
      }

      const url = `${PRODUCTS_URL}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      const response = await apiCall(url, {
        method: 'GET',
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get all products error:', error);
      throw error;
    }
  },

  async getProductById(id: string): Promise<ProductResponse> {
    try {
      const response = await apiCall(PRODUCT_BY_ID_URL(id), {
        method: 'GET',
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get product by ID error:', error);
      throw error;
    }
  },

  async createProduct(productData: CreateProductData): Promise<ProductResponse> {
    try {
      const response = await apiCall(CREATE_PRODUCT_URL, {
        method: 'POST',
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  },

  async updateProduct(id: string, productData: UpdateProductData): Promise<ProductResponse> {
    try {
      const response = await apiCall(PRODUCT_BY_ID_URL(id), {
        method: 'PUT',
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<{ message: string; data: { id: string; name: string } }> {
    try {
      const response = await apiCall(PRODUCT_BY_ID_URL(id), {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  },

  async getProductsByCategory(categoryId: string, params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ProductsResponse> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const url = `${PRODUCTS_BY_CATEGORY_URL(categoryId)}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      const response = await apiCall(url, {
        method: 'GET',
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get products by category error:', error);
      throw error;
    }
  },
};


