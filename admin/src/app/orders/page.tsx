"use client";

import { useState, useEffect, Suspense } from "react"; // 👈 IMPORT Suspense
export const dynamicParams = true;
import { useRouter, useSearchParams } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Package,
  Clock,
  CheckCircle,
  Search,
  Filter,
  Eye,
  Edit,
  RefreshCw,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  IndianRupee,
  Truck,
  AlertCircle,
  Ban,
  FileText,
  Download,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { ordersAPI, type Order, type OrderFilters } from "@/lib/api";

export const dynamic = "force-dynamic";

interface OrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (orderId: string, status: string, notes?: string) => void;
  onTrackingUpdate: (orderId: string, estimatedDelivery: string) => void;
  onRefund: (orderId: string, amount: number, reason: string) => void;
}

function OrderDetailsDialog({
  order,
  isOpen,
  onClose,
  onStatusUpdate,
  onTrackingUpdate,
  onRefund,
}: OrderDetailsDialogProps) {
  const [statusUpdateDialog, setStatusUpdateDialog] = useState(false);
  const [refundDialog, setRefundDialog] = useState(false);
  const [trackingDialog, setTrackingDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundReason, setRefundReason] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (order) {
      setNewStatus(order.orderStatus);
      setAdminNotes(order.adminNotes || "");
      setRefundAmount(order.totalAmount);
    }
  }, [order]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "payment_failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusUpdate = async () => {
    if (!order || !newStatus) return;

    setIsUpdating(true);
    try {
      await onStatusUpdate(order._id, newStatus, adminNotes);
      setStatusUpdateDialog(false);
      toast.success("Order status updated successfully");
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTrackingUpdate = async () => {
    if (!order || !estimatedDelivery) return;

    setIsUpdating(true);
    try {
      await onTrackingUpdate(order._id, estimatedDelivery);
      setTrackingDialog(false);
      toast.success("Tracking information updated successfully");
    } catch (error) {
      toast.error("Failed to update tracking information");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRefund = async () => {
    if (!order || !refundAmount || !refundReason) return;

    setIsUpdating(true);
    try {
      await onRefund(order._id, refundAmount, refundReason);
      setRefundDialog(false);
      toast.success("Refund processed successfully");
    } catch (error) {
      toast.error("Failed to process refund");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Details - #{order.orderNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Order Number:</span>
                <span className="font-mono">#{order.orderNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Status:</span>
                <Badge className={getStatusColor(order.orderStatus)}>
                  {order.orderStatus}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Payment Status:</span>
                <Badge
                  variant={
                    order.paymentStatus === "paid" ? "default" : "secondary"
                  }
                >
                  {order.paymentStatus}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Amount:</span>
                <span className="font-semibold text-lg">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Order Date:</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Payment Method:</span>
                <span>{order.paymentMethod}</span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span>{order.user.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{order.user.email}</span>
              </div>
              {order.user.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{order.user.phone}</span>
                </div>
              )}
              {order.shippingAddress && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div className="text-sm">
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}
                    </p>
                    <p>{order.shippingAddress.pincode}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {item.product && item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.title || 'Product'}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium">
                        {item.product?.title || 'Product not found'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(item.total)}</p>
                    <p className="text-sm text-gray-600">
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Admin Actions */}
        <div className="flex flex-wrap gap-2">
          <Dialog
            open={statusUpdateDialog}
            onOpenChange={setStatusUpdateDialog}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Update Status
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Order Status</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status" className="mb-2">
                    New Status
                  </Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div></div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setStatusUpdateDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleStatusUpdate} disabled={isUpdating}>
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Update Status
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={trackingDialog} onOpenChange={setTrackingDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Truck className="h-4 w-4 mr-2" />
                Update Tracking
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Tracking Information</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="estimatedDelivery" className="mb-2">
                    Estimated Delivery Date
                  </Label>
                  <Input
                    id="estimatedDelivery"
                    type="date"
                    value={estimatedDelivery}
                    onChange={(e) => setEstimatedDelivery(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setTrackingDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleTrackingUpdate} disabled={isUpdating}>
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Update Tracking
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {order.paymentStatus === "paid" && (
            <Dialog open={refundDialog} onOpenChange={setRefundDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <IndianRupee className="h-4 w-4 mr-2" />
                  Process Refund
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Process Refund</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="refundAmount">Refund Amount</Label>
                    <Input
                      id="refundAmount"
                      type="number"
                      value={refundAmount}
                      onChange={(e) =>
                        setRefundAmount(parseFloat(e.target.value))
                      }
                      max={order.totalAmount}
                    />
                  </div>
                  <div>
                    <Label htmlFor="refundReason">Refund Reason</Label>
                    <Textarea
                      id="refundReason"
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      placeholder="Reason for refund..."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setRefundDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleRefund}
                      disabled={isUpdating}
                      variant="destructive"
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Process Refund
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function OrdersPage() {
  // To satisfy the error, we must wrap the component logic that uses
  // `useSearchParams` in a <Suspense> boundary.
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrdersPageContent />
    </Suspense>
  );
}

// 👈 EXTRACTED OrdersPage logic into a new component OrdersPageContent
function OrdersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasNext: false,
    hasPrev: false,
  });

  const [filters, setFilters] = useState<OrderFilters>({
    page: 1,
    limit: 10,
    status: "",
    paymentStatus: "",
    search: "",
  });

  const [dashboardStats, setDashboardStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
  });

  useEffect(() => {
    fetchOrders();
    calculateStats();
  }, [filters]);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if (orderId && orders.length > 0) {
      const order = orders.find((o) => o._id === orderId);
      if (order) {
        setSelectedOrder(order);
        setOrderDetailsOpen(true);
      }
    }
  }, [searchParams, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ordersAPI.getAllOrders(filters);

      if (response.success && response.data) {
        setOrders(response.data.orders);
        setPagination(response.data.pagination);
      } else {
        setError(response.error || "Failed to fetch orders");
        toast.error("Failed to load orders");
      }
    } catch (error) {
      setError("Network error occurred");
      toast.error("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = async () => {
    try {
      // Get orders by status for dashboard stats
      const [pendingRes, processingRes, shippedRes] = await Promise.all([
        ordersAPI.getOrdersByStatus("pending", 1, 1),
        ordersAPI.getOrdersByStatus("processing", 1, 1),
        ordersAPI.getOrdersByStatus("shipped", 1, 1),
      ]);

      setDashboardStats({
        total: pagination.totalOrders,
        pending: pendingRes.data?.pagination?.totalOrders || 0,
        processing: processingRes.data?.pagination?.totalOrders || 0,
        shipped: shippedRes.data?.pagination?.totalOrders || 0,
        delivered: 0, // You might want to add delivered status endpoint
      });
    } catch (error) {
      console.error("Failed to calculate stats:", error);
    }
  };

  const handleFilterChange = (
    key: keyof OrderFilters,
    value: string | number
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? "" : value, // Convert 'all' to empty string for API
      page:
        key !== "page"
          ? 1
          : typeof value === "string"
          ? parseInt(value)
          : value, // Reset to page 1 when changing filters
    }));
  };

  const handleStatusUpdate = async (
    orderId: string,
    status: string,
    notes?: string
  ) => {
    try {
      const response = await ordersAPI.updateOrderStatus(
        orderId,
        status,
        notes
      );
      if (response.success) {
        // Update the order in the list
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId
              ? { ...order, orderStatus: status, adminNotes: notes }
              : order
          )
        );

        // Update selected order if it's the same
        if (selectedOrder?._id === orderId) {
          setSelectedOrder((prev) =>
            prev ? { ...prev, orderStatus: status, adminNotes: notes } : null
          );
        }

        fetchOrders(); // Refresh to get latest data
      }
    } catch (error) {
      throw error;
    }
  };

  const handleTrackingUpdate = async (
    orderId: string,
    estimatedDelivery: string
  ) => {
    try {
      const response = await ordersAPI.updateTrackingInfo(
        orderId,
        estimatedDelivery
      );
      if (response.success) {
        fetchOrders(); // Refresh to get latest data
      }
    } catch (error) {
      throw error;
    }
  };

  const handleRefund = async (
    orderId: string,
    amount: number,
    reason: string
  ) => {
    try {
      const response = await ordersAPI.processRefund(orderId, amount, reason);
      if (response.success) {
        fetchOrders(); // Refresh to get latest data
      }
    } catch (error) {
      throw error;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AdminHeader 
        title="VD Foods Admin" 
        subtitle="Orders" 
        currentPage="orders" 
      />
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                <ShoppingCart className="h-8 w-8 text-blue-600" />
                Order Management
              </h1>
              
            </div>
            <Button onClick={fetchOrders} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold">{pagination.totalOrders}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">
                    Pending Orders
                  </p>
                  <p className="text-2xl font-bold">{dashboardStats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Processing
                  </p>
                  <p className="text-2xl font-bold">
                    {dashboardStats.processing}
                  </p>
                </div>
                <Package className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Shipped</p>
                  <p className="text-2xl font-bold">{dashboardStats.shipped}</p>
                </div>
                <Truck className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Order number, email..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    className="pl-10 mt-2"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status" className="mb-2">
                  Order Status
                </Label>
                <Select
                  value={filters.status || "all"}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="paymentStatus" className="mb-2">
                  Payment Status
                </Label>
                <Select
                  value={filters.paymentStatus || "all"}
                  onValueChange={(value) =>
                    handleFilterChange("paymentStatus", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All payments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All payments</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="limit" className="mb-2">
                  Items per page
                </Label>
                <Select
                  value={filters.limit?.toString()}
                  onValueChange={(value) =>
                    handleFilterChange("limit", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Orders ({pagination.totalOrders})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border rounded-lg animate-pulse"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-8 bg-gray-200 rounded w-8"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-600">{error}</p>
                <Button
                  onClick={fetchOrders}
                  variant="outline"
                  className="mt-4"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No orders found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium">#{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">
                          {order.user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <Separator orientation="vertical" className="h-12" />
                      <div>
                        <p className="font-semibold">
                          {formatPrice(order.totalAmount)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.items.length} items
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusBadgeVariant(order.orderStatus)}>
                        {order.orderStatus}
                      </Badge>
                      <Badge
                        variant={
                          order.paymentStatus === "paid"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {order.paymentStatus}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(order);
                          setOrderDetailsOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {orders.length > 0 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  {(pagination.currentPage - 1) * (filters.limit || 10) + 1} to{" "}
                  {Math.min(
                    pagination.currentPage * (filters.limit || 10),
                    pagination.totalOrders
                  )}{" "}
                  of {pagination.totalOrders} orders
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleFilterChange("page", pagination.currentPage - 1)
                    }
                    disabled={!pagination.hasPrev}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleFilterChange("page", pagination.currentPage + 1)
                    }
                    disabled={!pagination.hasNext}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Details Dialog */}
        <OrderDetailsDialog
          order={selectedOrder}
          isOpen={orderDetailsOpen}
          onClose={() => {
            setOrderDetailsOpen(false);
            setSelectedOrder(null);
            // Remove orderId from URL if present
            if (searchParams.get("orderId")) {
              router.replace("/orders");
            }
          }}
          onStatusUpdate={handleStatusUpdate}
          onTrackingUpdate={handleTrackingUpdate}
          onRefund={handleRefund}
        />
      </div>
    </div>
  );
}
