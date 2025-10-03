"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaSignOutAlt,
  FaBoxOpen,
  FaEye,
} from "react-icons/fa";
import { NavbarDemo } from "components/navbar";
import Link from "next/link";
import Image from "next/image";
import ApiService, { Order } from "../../utils/api";

export const dynamic = "force-dynamic";

const Profile: React.FC = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchRecentOrders();
    }
  }, [isAuthenticated, user]);

  const fetchRecentOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);
      // Fetch only the first 3 recent orders for profile page
      const response = await ApiService.getUserOrders(1, 3);
      setRecentOrders(response.orders);
    } catch (error: any) {
      console.error("Failed to fetch recent orders:", error);
      setOrdersError(error.message || "Failed to load orders");
    } finally {
      setOrdersLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = (): void => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarDemo />

      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center">
                  <FaUser className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                  <p className="text-gray-600">
                    {user.role === "admin" ? "Administrator" : "Customer"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <FaSignOutAlt className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Personal Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaUser className="w-5 h-5 text-gray-500" />
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <p className="text-gray-900">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaEnvelope className="w-5 h-5 text-gray-500" />
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaPhone className="w-5 h-5 text-gray-500" />
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <p className="text-gray-900">
                    {user.phone || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FaBoxOpen className="text-amber-600" /> Recent Orders
              </h2>
              <Link href="/orders">
                <button className="text-amber-600 hover:text-amber-700 font-medium transition-colors">
                  View All Orders →
                </button>
              </Link>
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
              </div>
            ) : ordersError ? (
              <div className="text-center py-8">
                <FaBoxOpen className="w-16 h-16 text-red-300 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{ordersError}</p>
                <button
                  onClick={fetchRecentOrders}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <FaBoxOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No orders yet</p>
                <p className="text-gray-500 text-sm mb-6">
                  Start shopping to see your orders here
                </p>
                <Link href="/products">
                  <button className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                    Shop Now
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.createdAt)} • {order.items.length}{" "}
                          items
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          {formatPrice(order.totalAmount)}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="mb-3">
                      <div className="flex items-center space-x-3">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <div className="relative w-10 h-10 flex-shrink-0">
                              <Image
                                src={
                                  (typeof item.product === "object" &&
                                    item.product.image) ||
                                  "/placeholder.jpg"
                                }
                                alt={item.name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-800 line-clamp-1">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{order.items.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="text-sm text-gray-600">
                        <strong>Delivery to:</strong>{" "}
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}
                      </div>
                      <Link href={`/orders`}>
                        <button className=" bg-amber-200/40 py-1 px-2 rounded-lg flex items-center space-x-1 text-amber-600 hover:text-amber-700 text-sm font-medium transition-colors">
                          <FaEye className="w-3 h-3" />
                          <span>View Details</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}

                {/* View All Orders Button */}
                <div className="text-center pt-4">
                  <Link href="/orders">
                    <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      View All Orders
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
