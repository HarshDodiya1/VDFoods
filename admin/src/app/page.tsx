"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
  TrendingUp,
  Calendar,
  Settings,
  LogOut,
  User,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  ArrowRight,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Star,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Download,
  FileText,
  Mail,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import AdminHeader from "@/components/AdminHeader";
import { toast } from "sonner";
import { dashboardAPI, type DashboardData } from "@/lib/api";

interface DashboardStats extends DashboardData {
  // Additional properties if needed
}

function Dashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const { user, logout, changePassword } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsPeriod, setAnalyticsPeriod] = useState<
    "week" | "month" | "year"
  >("month");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (showAnalytics) {
      fetchAnalyticsData();
    }
  }, [showAnalytics, analyticsPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardAPI.getDashboard();

      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.error || "Failed to fetch dashboard data");
        toast.error("Failed to load dashboard data");
      }
    } catch (error) {
      setError("Network error occurred");
      toast.error("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      setAnalyticsLoading(true);
      const response = await dashboardAPI.getAnalytics(analyticsPeriod);

      if (response.success && response.data) {
        setAnalytics(response.data);
      } else {
        toast.error("Failed to load analytics data");
      }
    } catch (error) {
      toast.error("Failed to load analytics data");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
    if (showAnalytics) {
      fetchAnalyticsData();
    }
  };

  if (!isMounted) {
    return <LoadingSpinner />;
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
      case "completed":
        return "default";
      case "pending":
      case "payment_failed":
        return "secondary";
      case "processing":
      case "confirmed":
        return "outline";
      case "shipped":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  const quickActions = [
    {
      title: "Add Product",
      description: "Add a new product to your inventory",
      icon: Plus,
      color: "bg-blue-500",
      href: "/products",
    },
    {
      title: "View Products",
      description: "Manage your product catalog",
      icon: Package,
      color: "bg-green-500",
      href: "/products",
    },
    {
      title: "View Orders",
      description: "Check recent customer orders",
      icon: ShoppingCart,
      color: "bg-purple-500",
      href: "/orders",
    },
    {
      title: "Contact Requests",
      description: "View customer contact requests",
      icon: Mail,
      color: "bg-orange-500",
      href: "/contact-requests",
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"> 
        {/* Header */}
        <AdminHeader 
          title="VD Foods Admin" 
          subtitle="Dashboard" 
          currentPage="dashboard" 
        />

        {/* Main Content */}
        <main className="container mx-auto p-6 space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">
              Welcome back, <span className="text-blue-600">{user?.name}</span>!
              👋
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Here's what's happening with your VD Foods business today. Manage
              your products, track orders, and grow your business.
            </p>
          </div>

          {/* Stats Cards */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card
                  key={i}
                  className="border-0 shadow-lg bg-white/50 backdrop-blur-sm animate-pulse"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="h-12 w-12 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="grid grid-cols-1 gap-6">
              <Card className="border-0 shadow-lg bg-red-50 border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center space-x-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    <span>{error}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      className="ml-4"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white overflow-hidden relative">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">
                        Total Products
                      </p>
                      <p className="text-3xl font-bold">
                        {stats.overview.totalProducts}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="h-4 w-4 text-blue-200" />
                        <span className="text-blue-200 text-sm">
                          All products
                        </span>
                      </div>
                    </div>
                    <Package className="h-12 w-12 text-blue-200" />
                  </div>
                  <div className="absolute -right-4 -bottom-4 opacity-10">
                    <Package className="h-24 w-24" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 text-white overflow-hidden relative">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">
                        Total Orders
                      </p>
                      <p className="text-3xl font-bold">
                        {stats.overview.totalOrders}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="h-4 w-4 text-green-200" />
                        <span className="text-green-200 text-sm">
                          Today: {stats.overview.todayOrders}
                        </span>
                      </div>
                    </div>
                    <ShoppingCart className="h-12 w-12 text-green-200" />
                  </div>
                  <div className="absolute -right-4 -bottom-4 opacity-10">
                    <ShoppingCart className="h-24 w-24" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white overflow-hidden relative">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">
                        Total Users
                      </p>
                      <p className="text-3xl font-bold">
                        {stats.overview.totalUsers}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="h-4 w-4 text-purple-200" />
                        <span className="text-purple-200 text-sm">
                          Active customers
                        </span>
                      </div>
                    </div>
                    <Users className="h-12 w-12 text-purple-200" />
                  </div>
                  <div className="absolute -right-4 -bottom-4 opacity-10">
                    <Users className="h-24 w-24" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white overflow-hidden relative">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">
                        Total Revenue
                      </p>
                      <p className="text-3xl font-bold">
                        {formatPrice(stats.overview.totalRevenue)}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="h-4 w-4 text-orange-200" />
                        <span className="text-orange-200 text-sm">
                          This month:{" "}
                          {formatPrice(stats.overview.monthlyRevenue)}
                        </span>
                      </div>
                    </div>
                    <IndianRupee className="h-12 w-12 text-orange-200" />
                  </div>
                  <div className="absolute -right-4 -bottom-4 opacity-10">
                    <IndianRupee className="h-24 w-24" />
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Activity className="h-6 w-6 text-blue-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Frequently used actions to manage your business efficiently
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, index) => (
                  <Card
                    key={index}
                    className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white/80 backdrop-blur-sm"
                    onClick={() => router.push(action.href)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div
                            className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center`}
                          >
                            <action.icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {action.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Recent Orders
                </CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border animate-pulse"
                        >
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                            <div className="h-3 bg-gray-200 rounded w-12"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : stats?.recentOrders && stats.recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {stats.recentOrders.map((order) => (
                        <div
                          key={order._id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() =>
                            router.push(`/orders?orderId=${order._id}`)
                          }
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.user.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Order #{order.orderNumber}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">
                              {formatPrice(order.totalAmount)}
                            </p>
                            <Badge
                              variant={getStatusBadgeVariant(order.orderStatus)}
                              className="text-xs"
                            >
                              {order.orderStatus}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 text-gray-500">
                      <div className="text-center">
                        <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No recent orders</p>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-yellow-600" />
                  Order Status Overview
                </CardTitle>
                <CardDescription>Current order distribution</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border animate-pulse"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-8"></div>
                      </div>
                    ))}
                  </div>
                ) : stats ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm font-medium">
                          Pending Orders
                        </span>
                      </div>
                      <span className="font-semibold text-orange-600">
                        {stats.orderStatus.pending}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">Processing</span>
                      </div>
                      <span className="font-semibold text-blue-600">
                        {stats.orderStatus.processing}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-medium">Shipped</span>
                      </div>
                      <span className="font-semibold text-purple-600">
                        {stats.orderStatus.shipped}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">
                          Today's Revenue
                        </span>
                      </div>
                      <span className="font-semibold text-green-600">
                        {formatPrice(stats.overview.todayRevenue)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-500">
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No data available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Analytics Section */}
          <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Analytics & Reports
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Select
                    value={analyticsPeriod}
                    onValueChange={(value: "week" | "month" | "year") =>
                      setAnalyticsPeriod(value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAnalytics(!showAnalytics)}
                  >
                    {showAnalytics ? "Hide Analytics" : "Show Analytics"}
                  </Button>
                </div>
              </div>
              <CardDescription>
                Detailed insights and performance metrics for your business
              </CardDescription>
            </CardHeader>

            {showAnalytics && (
              <CardContent>
                {analyticsLoading ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="p-4 border rounded-lg animate-pulse"
                        >
                          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : analytics ? (
                  <div className="space-y-6">
                    {/* Revenue Chart Data */}
                    {analytics.revenue && analytics.revenue.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold mb-4">
                          Revenue Trends
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {analytics.revenue.map((item: any, index: number) => (
                            <Card
                              key={index}
                              className="border border-gray-200"
                            >
                              <CardContent className="p-4">
                                <div className="text-center">
                                  <p className="text-sm text-gray-600">
                                    {item._id}
                                  </p>
                                  <p className="text-lg font-semibold text-green-600">
                                    {formatPrice(item.revenue)}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {item.orders} orders
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Top Products */}
                    {analytics.topProducts &&
                      analytics.topProducts.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold mb-4">
                            Top Selling Products
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {analytics.topProducts
                              .slice(0, 6)
                              .map((product: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 border rounded-lg bg-white"
                                >
                                  <div className="flex items-center gap-3">
                                    {product.productDetails?.[0]?.image && (
                                      <img
                                        src={product.productDetails[0].image}
                                        alt={product.name}
                                        className="w-10 h-10 object-cover rounded"
                                      />
                                    )}
                                    <div>
                                      <p className="font-medium">
                                        {product.name}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {product.totalSold} sold
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold text-green-600">
                                      {formatPrice(product.revenue)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                    {/* Order Status Distribution */}
                    {analytics.orderStatus &&
                      analytics.orderStatus.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold mb-4">
                            Order Status Distribution
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {analytics.orderStatus.map(
                              (status: any, index: number) => (
                                <Card
                                  key={index}
                                  className="border border-gray-200"
                                >
                                  <CardContent className="p-4 text-center">
                                    <p className="text-sm text-gray-600 capitalize">
                                      {status._id}
                                    </p>
                                    <p className="text-2xl font-bold text-blue-600">
                                      {status.count}
                                    </p>
                                  </CardContent>
                                </Card>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Top Customers */}
                    {analytics.topCustomers &&
                      analytics.topCustomers.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold mb-4">
                            Top Customers
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {analytics.topCustomers
                              .slice(0, 6)
                              .map((customer: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 border rounded-lg bg-white"
                                >
                                  <div>
                                    <p className="font-medium">
                                      {customer.userDetails?.[0]?.name ||
                                        "Unknown User"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {customer.totalOrders} orders
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold text-green-600">
                                      {formatPrice(customer.totalSpent)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                    {/* Export Options */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <p className="text-sm text-gray-600">
                        Data for {analytics.period} (
                        {analytics.dateRange?.startDate &&
                          new Date(
                            analytics.dateRange.startDate
                          ).toLocaleDateString()}{" "}
                        -{" "}
                        {analytics.dateRange?.endDate &&
                          new Date(
                            analytics.dateRange.endDate
                          ).toLocaleDateString()}
                        )
                      </p>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No analytics data available</p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
