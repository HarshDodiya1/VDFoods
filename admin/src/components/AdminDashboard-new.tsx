'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp,
  Calendar,
  Activity
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();

  // Mock data for dashboard cards
  const stats = [
    {
      title: 'Total Users',
      value: '2,543',
      change: '+12%',
      changeType: 'increase' as const,
      icon: Users,
      description: 'Active customers this month'
    },
    {
      title: 'Total Products',
      value: '1,247',
      change: '+3%',
      changeType: 'increase' as const,
      icon: Package,
      description: 'Products in inventory'
    },
    {
      title: 'Total Orders',
      value: '3,891',
      change: '+18%',
      changeType: 'increase' as const,
      icon: ShoppingCart,
      description: 'Orders this month'
    },
    {
      title: 'Revenue',
      value: '₹1,23,456',
      change: '+8%',
      changeType: 'increase' as const,
      icon: TrendingUp,
      description: 'Total revenue this month'
    }
  ];

  const recentActivities = [
    {
      action: 'New order received',
      details: 'Order #12345 from John Doe',
      time: '2 minutes ago',
      type: 'order'
    },
    {
      action: 'Product added',
      details: 'Organic Turmeric Powder added to inventory',
      time: '15 minutes ago',
      type: 'product'
    },
    {
      action: 'User registered',
      details: 'Sarah Wilson joined as a new customer',
      time: '1 hour ago',
      type: 'user'
    },
    {
      action: 'Order shipped',
      details: 'Order #12340 has been shipped',
      time: '2 hours ago',
      type: 'shipping'
    },
    {
      action: 'Payment received',
      details: 'Payment of ₹2,450 received for Order #12339',
      time: '3 hours ago',
      type: 'payment'
    }
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h2>
        <p className="text-gray-600">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <IconComponent className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className={`font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500">from last month</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>
              Latest activities in your store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'order' ? 'bg-blue-500' :
                    activity.type === 'product' ? 'bg-green-500' :
                    activity.type === 'user' ? 'bg-purple-500' :
                    activity.type === 'shipping' ? 'bg-orange-500' :
                    'bg-yellow-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.details}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>
              Common tasks to manage your store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Package className="h-6 w-6 text-blue-600 mb-2" />
                <div className="text-sm font-medium text-gray-900">Add Product</div>
                <div className="text-xs text-gray-500">Add new product to inventory</div>
              </button>
              
              <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ShoppingCart className="h-6 w-6 text-green-600 mb-2" />
                <div className="text-sm font-medium text-gray-900">View Orders</div>
                <div className="text-xs text-gray-500">Manage customer orders</div>
              </button>
              
              <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="h-6 w-6 text-purple-600 mb-2" />
                <div className="text-sm font-medium text-gray-900">Manage Users</div>
                <div className="text-xs text-gray-500">View customer accounts</div>
              </button>
              
              <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <TrendingUp className="h-6 w-6 text-orange-600 mb-2" />
                <div className="text-sm font-medium text-gray-900">Analytics</div>
                <div className="text-xs text-gray-500">View sales reports</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-sm text-gray-500">
          VD Foods Admin Dashboard - Manage your spice business with ease
        </p>
      </div>
    </div>
  );
}
