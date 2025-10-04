// frontend/src/utils/api.ts

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface OtpData {
  email: string;
  otp: string;
}

interface ResetPasswordData {
  email: string;
  newPassword: string;
}

interface ApiResponse<T = any> {
  message: string;
  data?: T;
  token?: string;
  user?: User;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  isVerified?: boolean;
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

interface ContactFormData {
  fullName: string;
  email: string;
  phoneNumber?: string;
  inquiryType: string;
  message: string;
}

interface ContactEntry {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  inquiryType: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  _id: string;
  title: string;
  slug?: string;
  description: string;
  price: string;
  oldPrice?: string;
  image: string;
  images?: string[];
  category: string;
  badge?: string;
  rating: number;
  reviews: number;
  tags?: string[];
  weight?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductResponse {
  message: string;
  data: {
    products: Product[];
    total: number;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalProducts: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

interface CartItem {
  _id?: string;
  product: Product;
  quantity: number;
  priceAtTime: number;
}

interface Cart {
  _id?: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ShippingAddress {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: {
    product: Product | string;
    name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "payment_failed";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  confirmedAt?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

interface CreateOrderResponse {
  success: boolean;
  message: string;
  order: {
    orderId: string;
    orderNumber: string;
    totalAmount: number;
    razorpayOrder: RazorpayOrder;
  };
}

interface PaymentVerificationData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}

interface Cart {
  _id?: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
  }

  // Helper method to get auth headers
  private getAuthHeaders(): Record<string, string> {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Generic API call method
  private async apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Handle token expiry (401 Unauthorized)
      if (response.status === 401) {
        // Clear expired token and user data
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          // Redirect to login page
          window.location.href = "/auth";
        }
        throw new Error("Session expired. Please login again.");
      }

      // ✅ ADDED: Better error handling for non-JSON responses
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response isn't JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || "Network error occurred");
      }
      throw new Error("An unexpected error occurred");
    }
  }

  // Auth API methods
  async register(userData: RegisterData): Promise<ApiResponse> {
    return this.apiCall<ApiResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse> {
    return this.apiCall<ApiResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async sendOtp(email: string): Promise<ApiResponse> {
    return this.apiCall<ApiResponse>("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async verifyOtp(otpData: OtpData): Promise<ApiResponse> {
    return this.apiCall<ApiResponse>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(otpData),
    });
  }

  async resetPassword(resetData: ResetPasswordData): Promise<ApiResponse> {
    return this.apiCall<ApiResponse>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(resetData),
    });
  }

  // Product API methods
  async getAllProducts(): Promise<ProductResponse> {
    return this.apiCall<ProductResponse>("/products", {
      method: "GET",
    });
  }

  async getProductById(
    id: string
  ): Promise<{ message: string; data: Product }> {
    return this.apiCall<{ message: string; data: Product }>(`/products/${id}`, {
      method: "GET",
    });
  }

  async getProductBySlug(
    slug: string
  ): Promise<{ message: string; data: Product }> {
    return this.apiCall<{ message: string; data: Product }>(
      `/products/slug/${slug}`,
      {
        method: "GET",
      }
    );
  }

  // Cart API methods
  async addToCart(
    productId: string,
    quantity: number = 1
  ): Promise<ApiResponse> {
    return this.apiCall<ApiResponse>("/cart/add", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async getCart(): Promise<{ message: string; data: Cart }> {
    return this.apiCall<{ message: string; data: Cart }>("/cart", {
      method: "GET",
    });
  }

  async updateCartItem(
    productId: string,
    quantity: number
  ): Promise<ApiResponse> {
    return this.apiCall<ApiResponse>("/cart/update", {
      method: "PUT",
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async removeFromCart(productId: string): Promise<ApiResponse> {
    return this.apiCall<ApiResponse>(`/cart/item/${productId}`, {
      method: "DELETE",
    });
  }

  async clearCart(): Promise<ApiResponse> {
    return this.apiCall<ApiResponse>("/cart/clear", {
      method: "DELETE",
    });
  }

  async getCartItemCount(): Promise<{
    message: string;
    data: { itemCount: number; totalAmount: number };
  }> {
    return this.apiCall<{
      message: string;
      data: { itemCount: number; totalAmount: number };
    }>("/cart/count", {
      method: "GET",
    });
  }

  // Order Management Methods
  async getRazorpayKey(): Promise<{ success: boolean; key: string }> {
    return this.apiCall<{ success: boolean; key: string }>(
      "/orders/razorpay-key",
      {
        method: "GET",
      }
    );
  }

  async createOrder(
    shippingAddress: ShippingAddress
  ): Promise<CreateOrderResponse> {
    const user = this.getUserFromStorage();
    return this.apiCall<CreateOrderResponse>("/orders/create-order", {
      method: "POST",
      body: JSON.stringify({
        shippingAddress,
        user: { id: user?.id },
      }),
    });
  }

  async verifyPayment(
    paymentData: PaymentVerificationData
  ): Promise<ApiResponse> {
    return this.apiCall<ApiResponse>("/orders/verify-payment", {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
  }

  async handlePaymentFailure(
    orderId: string,
    error: any
  ): Promise<ApiResponse> {
    return this.apiCall<ApiResponse>("/orders/payment-failed", {
      method: "POST",
      body: JSON.stringify({ orderId, error }),
    });
  }

  async getUserOrders(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    success: boolean;
    orders: Order[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalOrders: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }> {
    return this.apiCall<{
      success: boolean;
      orders: Order[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalOrders: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }>(`/orders/orders?page=${page}&limit=${limit}`, {
      method: "GET",
    });
  }

  async getOrderDetails(
    orderId: string
  ): Promise<{ success: boolean; order: Order }> {
    return this.apiCall<{ success: boolean; order: Order }>(
      `/orders/orders/${orderId}`,
      {
        method: "GET",
      }
    );
  }

  async cancelOrder(orderId: string): Promise<ApiResponse> {
    return this.apiCall<ApiResponse>(`/orders/orders/${orderId}/cancel`, {
      method: "POST",
    });
  }

  // Contact form submission
  async submitContactForm(contactData: ContactFormData): Promise<{
    success: boolean;
    message: string;
    data?: ContactEntry;
  }> {
    return this.apiCall<{
      success: boolean;
      message: string;
      data?: ContactEntry;
    }>("/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    });
  }

  // Get all contact requests (Admin only)
  async getAllContactRequests(): Promise<{
    success: boolean;
    count: number;
    data: ContactEntry[];
  }> {
    return this.apiCall<{
      success: boolean;
      count: number;
      data: ContactEntry[];
    }>("/contact", {
      method: "GET",
    });
  }

  // Helper method to get user from storage
  private getUserFromStorage(): User | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }
}

export default new ApiService();
export type {
  User,
  Product,
  ProductResponse,
  LoginCredentials,
  RegisterData,
  OtpData,
  ResetPasswordData,
  ApiResponse,
  Cart,
  CartItem,
  ShippingAddress,
  Order,
  RazorpayOrder,
  CreateOrderResponse,
  PaymentVerificationData,
  ContactFormData,
  ContactEntry,
};
