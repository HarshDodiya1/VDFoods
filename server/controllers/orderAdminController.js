const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const Cart = require("../models/cartModel");

// Dashboard Overview
exports.getDashboard = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Get dashboard statistics
    const [
      totalOrders,
      todayOrders,
      monthlyOrders,
      totalRevenue,
      monthlyRevenue,
      todayRevenue,
      totalUsers,
      totalProducts,
      pendingOrders,
      processingOrders,
      shippedOrders,
      recentOrders
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfDay } }),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]),
      Order.aggregate([
        { 
          $match: { 
            paymentStatus: "paid",
            createdAt: { $gte: startOfMonth }
          }
        },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]),
      Order.aggregate([
        { 
          $match: { 
            paymentStatus: "paid",
            createdAt: { $gte: startOfDay }
          }
        },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]),
      User.countDocuments({ role: "user" }),
      Product.countDocuments(),
      Order.countDocuments({ orderStatus: "pending" }),
      Order.countDocuments({ orderStatus: "processing" }),
      Order.countDocuments({ orderStatus: "shipped" }),
      Order.find()
        .populate("user", "name email")
        .populate("items.product", "title image")
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    // Sales chart data (last 7 days)
    const salesChartData = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: { 
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
          }
        }
      },
      {
        $group: {
          _id: { 
            $dateToString: { 
              format: "%Y-%m-%d", 
              date: "$createdAt" 
            }
          },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalOrders,
          todayOrders,
          monthlyOrders,
          totalRevenue: totalRevenue[0]?.total || 0,
          monthlyRevenue: monthlyRevenue[0]?.total || 0,
          todayRevenue: todayRevenue[0]?.total || 0,
          totalUsers,
          totalProducts
        },
        orderStatus: {
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders
        },
        recentOrders,
        salesChart: salesChartData
      }
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message
    });
  }
};

// Get All Orders with Filters
exports.getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      startDate,
      endDate,
      search
    } = req.query;

    const skip = (page - 1) * limit;
    
    // Build filter query
    let filter = {};
    
    if (status) filter.orderStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Search in order number or user email
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { orderNumber: searchRegex },
        // For user email search, we'll use a different approach since user is a reference
      ];
      
      // If search looks like an email or username, search users first
      if (search.includes('@') || search.length > 3) {
        const users = await User.find({
          $or: [
            { email: searchRegex },
            { name: searchRegex }
          ]
        }).select('_id');
        
        if (users.length > 0) {
          filter.$or.push({ user: { $in: users.map(u => u._id) } });
        }
      }
    }

    const [orders, totalOrders] = await Promise.all([
      Order.find(filter)
        .populate("user", "name email phone")
        .populate("items.product", "title image")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalOrders / limit),
          totalOrders,
          hasNext: page * limit < totalOrders,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};

// Get Order Details
exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("user", "name email phone address")
      .populate("items.product", "title image price category");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      data: { order }
    });

  } catch (error) {
    console.error("Get order details error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order details",
      error: error.message
    });
  }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = [
      "pending", "confirmed", "processing", 
      "shipped", "delivered", "cancelled", "payment_failed"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      });
    }

    const updateData = {
      orderStatus: status,
      adminNotes: adminNotes || ""
    };

    // Set timestamps based on status
    switch (status) {
      case "confirmed":
        updateData.confirmedAt = new Date();
        break;
      case "shipped":
        updateData.shippedAt = new Date();
        break;
      case "delivered":
        updateData.deliveredAt = new Date();
        break;
      case "cancelled":
        updateData.cancelledAt = new Date();
        break;
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // TODO: Send email notification to customer
    // await sendOrderStatusUpdateEmail(order);

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: { order }
    });

  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message
    });
  }
};

// Update Tracking Information
exports.updateTrackingInfo = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { estimatedDelivery } = req.body;

    const updateData = {};
    if (estimatedDelivery) {
      updateData.estimatedDelivery = new Date(estimatedDelivery);
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Tracking information updated successfully",
      data: { order }
    });

  } catch (error) {
    console.error("Update tracking info error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update tracking information",
      error: error.message
    });
  }
};

// Get Orders by Status
exports.getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [orders, totalOrders] = await Promise.all([
      Order.find({ orderStatus: status })
        .populate("user", "name email phone")
        .populate("items.product", "title image")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments({ orderStatus: status })
    ]);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalOrders / limit),
          totalOrders
        }
      }
    });

  } catch (error) {
    console.error("Get orders by status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};

// Process Refund
exports.processRefund = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { refundAmount, refundReason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.paymentStatus !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Order payment is not in paid status"
      });
    }

    // TODO: Implement actual refund with Razorpay
    // const refund = await razorpay.payments.refund(order.razorpayPaymentId, {
    //   amount: refundAmount * 100,
    //   notes: { reason: refundReason }
    // });

    order.paymentStatus = refundAmount >= order.totalAmount ? "refunded" : "partially_refunded";
    order.orderStatus = "cancelled";
    order.adminNotes = `Refund processed: ${refundReason}`;
    order.cancelledAt = new Date();

    await order.save();

    res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      data: { order }
    });

  } catch (error) {
    console.error("Process refund error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process refund",
      error: error.message
    });
  }
};

// Get Analytics Data
exports.getAnalytics = async (req, res) => {
  try {
    const { period = "month" } = req.query;
    
    let startDate;
    const endDate = new Date();
    
    switch (period) {
      case "week":
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        break;
      case "year":
        startDate = new Date(endDate.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    }

    // Revenue analytics
    const revenueData = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: period === "year" ? "%Y-%m" : "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: "$items.total" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      }
    ]);

    // Order status distribution
    const orderStatusData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 }
        }
      }
    ]);

    // Customer analytics
    const customerData = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: "$user",
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        period,
        dateRange: { startDate, endDate },
        revenue: revenueData,
        topProducts,
        orderStatus: orderStatusData,
        topCustomers: customerData
      }
    });

  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics data",
      error: error.message
    });
  }
};
