export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const API_URL = `${BASE_URL}/api`;

// Authentication APIs
export const LOGIN_URL = `${API_URL}/admin/login`;
export const ME = `${API_URL}/admin/me`;
export const LOGOUT_URL = `${API_URL}/admin/logout`;
export const CHANGE_PASSWORD_URL = `${API_URL}/admin/change-password`;

// Product APIs
export const PRODUCTS_URL = `${API_URL}/products`;
export const PRODUCT_BY_ID_URL = (id: string) => `${API_URL}/products/${id}`;
export const PRODUCTS_BY_CATEGORY_URL = (categoryId: string) =>
  `${API_URL}/products/category/${categoryId}`;

// Admin Dashboard & Analytics APIs
export const ADMIN_DASHBOARD_URL = `${API_URL}/admin/orders/dashboard`;
export const ADMIN_ANALYTICS_URL = `${API_URL}/admin/orders/analytics`;

// Admin Order Management APIs
export const ADMIN_ORDERS_URL = `${API_URL}/admin/orders/orders`;
export const ADMIN_ORDER_DETAILS_URL = (orderId: string) =>
  `${API_URL}/admin/orders/orders/${orderId}`;
export const ADMIN_ORDER_STATUS_URL = (orderId: string) =>
  `${API_URL}/admin/orders/orders/${orderId}/status`;
export const ADMIN_ORDER_TRACKING_URL = (orderId: string) =>
  `${API_URL}/admin/orders/orders/${orderId}/tracking`;
export const ADMIN_ORDER_REFUND_URL = (orderId: string) =>
  `${API_URL}/admin/orders/orders/${orderId}/refund`;
export const ADMIN_ORDERS_BY_STATUS_URL = (status: string) =>
  `${API_URL}/admin/orders/orders/status/${status}`;

// Product APIs for Admin
export const GET_PRODUCTS_URL = `${API_URL}/products`;
export const GET_PRODUCT_URL = (id: string) => `${API_URL}/products/${id}`;
export const CREATE_PRODUCT_URL = `${API_URL}/products`;
export const UPDATE_PRODUCT_URL = (id: string) => `${API_URL}/products/${id}`;
export const DELETE_PRODUCT_URL = (id: string) => `${API_URL}/products/${id}`;

// API Helper Functions
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface DashboardData {
  overview: {
    totalOrders: number;
    todayOrders: number;
    monthlyOrders: number;
    totalRevenue: number;
    monthlyRevenue: number;
    todayRevenue: number;
    totalUsers: number;
    totalProducts: number;
  };
  orderStatus: {
    pending: number;
    processing: number;
    shipped: number;
  };
  recentOrders: any[];
  salesChart: any[];
}

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: Array<{
    product: {
      _id: string;
      title: string;
      image: string;
      price: number;
      category?: string;
    };
    quantity: number;
    price: number;
    total: number;
    name: string;
  }>;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: any;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
  estimatedDelivery?: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

const apiRequest = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: "include", // Important for cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// Dashboard API Functions
export const dashboardAPI = {
  getDashboard: (): Promise<ApiResponse<DashboardData>> => {
    return apiRequest(ADMIN_DASHBOARD_URL);
  },

  getAnalytics: (
    period: "week" | "month" | "year" = "month"
  ): Promise<ApiResponse> => {
    return apiRequest(`${ADMIN_ANALYTICS_URL}?period=${period}`);
  },
};

// Orders API Functions
export const ordersAPI = {
  getAllOrders: (
    filters: OrderFilters = {}
  ): Promise<ApiResponse<{ orders: Order[]; pagination: any }>> => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const url = queryParams.toString()
      ? `${ADMIN_ORDERS_URL}?${queryParams.toString()}`
      : ADMIN_ORDERS_URL;

    return apiRequest(url);
  },

  getOrderDetails: (
    orderId: string
  ): Promise<ApiResponse<{ order: Order }>> => {
    return apiRequest(ADMIN_ORDER_DETAILS_URL(orderId));
  },

  updateOrderStatus: (
    orderId: string,
    status: string,
    adminNotes?: string
  ): Promise<ApiResponse<{ order: Order }>> => {
    return apiRequest(ADMIN_ORDER_STATUS_URL(orderId), {
      method: "PUT",
      body: JSON.stringify({ status, adminNotes }),
    });
  },

  updateTrackingInfo: (
    orderId: string,
    estimatedDelivery: string
  ): Promise<ApiResponse<{ order: Order }>> => {
    return apiRequest(ADMIN_ORDER_TRACKING_URL(orderId), {
      method: "PUT",
      body: JSON.stringify({ estimatedDelivery }),
    });
  },

  processRefund: (
    orderId: string,
    refundAmount: number,
    refundReason: string
  ): Promise<ApiResponse<{ order: Order }>> => {
    return apiRequest(ADMIN_ORDER_REFUND_URL(orderId), {
      method: "POST",
      body: JSON.stringify({ refundAmount, refundReason }),
    });
  },

  getOrdersByStatus: (
    status: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<{ orders: Order[]; pagination: any }>> => {
    return apiRequest(
      `${ADMIN_ORDERS_BY_STATUS_URL(status)}?page=${page}&limit=${limit}`
    );
  },
};

export type { ApiResponse, DashboardData, Order, OrderFilters };
