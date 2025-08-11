'use client';

import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  ShoppingBag, 
  Package, 
  TrendingUp,
  DollarSign,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiCall } from '@/lib/auth';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard stats
        const [statsResponse, ordersResponse] = await Promise.all([
          apiCall('/api/admin/dashboard/stats'),
          apiCall('/api/admin/orders/recent')
        ]);
        
        setStats(statsResponse.data || stats);
        setRecentOrders(ordersResponse.data || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || 'Admin'}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor} mr-4`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            </div>
            <div className="p-6">
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                            <p className="text-sm text-gray-600">{order.customerName}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className="font-semibold text-gray-900">₹{order.total}</span>
                        <div className="flex space-x-1">
                          <button className="p-1 text-gray-500 hover:text-blue-600">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-500 hover:text-green-600">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent orders found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 font-medium transition-colors">
                Add New Product
              </button>
              <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 font-medium transition-colors">
                View All Orders
              </button>
              <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 font-medium transition-colors">
                Manage Categories
              </button>
              <button className="w-full text-left p-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-700 font-medium transition-colors">
                View Reports
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">New Orders</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Orders</span>
                <span className="font-semibold">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivered</span>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-600">Revenue Today</span>
                <span className="font-semibold text-green-600">₹15,420</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
