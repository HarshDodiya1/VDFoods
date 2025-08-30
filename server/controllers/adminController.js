// adminController.js

const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config.js");

const JWT_SECRET = config.jwtSecret;

// Helper function to generate JWT token
const generateToken = (userId, email, role) => {
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: "24h" }, // Admin sessions last 24 hours
  );
};

// Helper function to verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Controller for admin login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic input validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // 3. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid Email or password." });
    }

    // 4. Check if user is admin
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin privileges required." });
    }

    // 6. Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password is incorrect." });
    }

    // 7. Generate JWT token
    const token = generateToken(user._id, user.email, user.role);

    // 8. Set token as httpOnly cookie
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // 9. Send successful response
    res.status(200).json({
      message: "Admin login successful!",
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Controller to get current admin info
const me = async (req, res) => {
  try {
    // 1. Read JWT from cookie
    const token = req.cookies.adminToken;

    if (!token) {
      return res
        .status(401)
        .json({ message: "No authentication token found." });
    }

    // 2. Verify JWT signature
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    // 3. Check if user is admin
    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin privileges required." });
    }

    // 4. Get user info from database (to ensure user still exists and is active)
    const admin = await User.findById(decoded.userId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    // 5. Check if admin is still verified and has admin role
    if (admin.role !== "admin") {
      // Clear the invalid cookie
      res.clearCookie("adminToken");
      return res.status(403).json({ message: "Admin access revoked." });
    }

    // 6. Return admin info
    res.status(200).json({
      message: "Admin info retrieved successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        phone: admin.phone,
        address: admin.address,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get admin info error:", error);
    res
      .status(500)
      .json({ message: "Server error while retrieving admin info" });
  }
};

// Controller for admin logout
const logout = async (req, res) => {
  try {
    // 1. Check if token exists
    const token = req.cookies.adminToken;

    if (!token) {
      return res.status(400).json({ message: "No active session found." });
    }

    // 2. Clear the JWT cookie
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // 3. Send successful response
    res.status(200).json({ message: "Admin logged out successfully" });
  } catch (error) {
    console.error("Admin logout error:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
};

// Controller for admin Password change.
const changePassword = async (req, res) => {
  try {
    // 1. Verify admin authentication
    const token = req.cookies.adminToken;
    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access required." });
    }

    // 2. Get request data
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // 3. Input validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ 
        message: "Current password, new password, and confirm password are required." 
      });
    }

    // 4. Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "New password and confirm password do not match." });
    }

    // 5. Password strength validation
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        message: 'New password must be at least 8 characters long.' 
      });
    }

    // 6. Get admin from database
    const admin = await User.findById(decoded.userId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    // 7. Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    // 8. Check if new password is different from current password
    const isSamePassword = await bcrypt.compare(newPassword, admin.password);
    if (isSamePassword) {
      return res.status(400).json({ 
        message: "New password must be different from current password." 
      });
    }

    // 9. Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    admin.password = hashedPassword;
    await admin.save();

    // 10. Send successful response
    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error during password change" });
  }
};

// Controller to get admin dashboard data
// const dashboard = async (req, res) => {
//   try {
//     // 1. Verify admin authentication
//     const token = req.cookies.adminToken;
//     if (!token) {
//       return res.status(401).json({ message: 'Authentication required.' });
//     }

//     const decoded = verifyToken(token);
//     if (!decoded || decoded.role !== 'admin') {
//       return res.status(403).json({ message: 'Admin access required.' });
//     }

//     // 2. Get dashboard statistics
//     const Product = require('../models/productModel');
//     const Order = require('../models/orderModel');

//     // Get counts
//     const [totalUsers, totalProducts, totalOrders] = await Promise.all([
//       User.countDocuments({ role: 'user' }),
//       Product.countDocuments(),
//       Order.countDocuments()
//     ]);

//     // Get recent orders (last 10)
//     const recentOrders = await Order.find()
//       .populate('user', 'name email')
//       .sort({ createdAt: -1 })
//       .limit(10)
//       .lean();

//     // Get revenue statistics (you can customize this based on your order model)
//     const revenueStats = await Order.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalRevenue: { $sum: '$totalAmount' },
//           averageOrderValue: { $avg: '$totalAmount' }
//         }
//       }
//     ]);

//     // Get monthly order counts for the last 6 months
//     const sixMonthsAgo = new Date();
//     sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

//     const monthlyOrders = await Order.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: sixMonthsAgo }
//         }
//       },
//       {
//         $group: {
//           _id: {
//             year: { $year: '$createdAt' },
//             month: { $month: '$createdAt' }
//           },
//           count: { $sum: 1 },
//           revenue: { $sum: '$totalAmount' }
//         }
//       },
//       {
//         $sort: { '_id.year': 1, '_id.month': 1 }
//       }
//     ]);

//     res.status(200).json({
//       message: 'Dashboard data retrieved successfully',
//       data: {
//         overview: {
//           totalUsers,
//           totalProducts,
//           totalOrders,
//           totalRevenue: revenueStats[0]?.totalRevenue || 0,
//           averageOrderValue: revenueStats[0]?.averageOrderValue || 0
//         },
//         recentOrders,
//         monthlyStats: monthlyOrders
//       }
//     });

//   } catch (error) {
//     console.error('Dashboard error:', error);
//     res.status(500).json({ message: 'Server error while retrieving dashboard data' });
//   }
// };

// Controller to get all orders for admin
// const getOrders = async (req, res) => {
//   try {
//     // 1. Verify admin authentication
//     const token = req.cookies.adminToken;
//     if (!token) {
//       return res.status(401).json({ message: 'Authentication required.' });
//     }

//     const decoded = verifyToken(token);
//     if (!decoded || decoded.role !== 'admin') {
//       return res.status(403).json({ message: 'Admin access required.' });
//     }

//     // 2. Get query parameters
//     const {
//       page = 1,
//       limit = 20,
//       status,
//       sortBy = 'createdAt',
//       sortOrder = 'desc',
//       search
//     } = req.query;

//     // 3. Build filter object
//     const filter = {};

//     if (status) {
//       filter.status = status;
//     }

//     if (search) {
//       filter.$or = [
//         { orderNumber: { $regex: search, $options: 'i' } },
//         { 'user.name': { $regex: search, $options: 'i' } },
//         { 'user.email': { $regex: search, $options: 'i' } }
//       ];
//     }

//     // 4. Pagination
//     const pageNumber = Math.max(1, parseInt(page));
//     const limitNumber = Math.max(1, Math.min(100, parseInt(limit)));
//     const skip = (pageNumber - 1) * limitNumber;

//     // 5. Sort options
//     const sortOptions = {};
//     const validSortFields = ['createdAt', 'updatedAt', 'totalAmount', 'status'];
//     if (validSortFields.includes(sortBy)) {
//       sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
//     } else {
//       sortOptions.createdAt = -1;
//     }

//     // 6. Get orders
//     const Order = require('../models/orderModel');
//     const orders = await Order.find(filter)
//       .populate('user', 'name email phone')
//       .populate('items.product', 'name price images')
//       .sort(sortOptions)
//       .skip(skip)
//       .limit(limitNumber)
//       .lean();

//     // 7. Get total count
//     const totalOrders = await Order.countDocuments(filter);
//     const totalPages = Math.ceil(totalOrders / limitNumber);

//     res.status(200).json({
//       message: 'Orders retrieved successfully',
//       data: {
//         orders,
//         pagination: {
//           currentPage: pageNumber,
//           totalPages,
//           totalOrders,
//           hasNextPage: pageNumber < totalPages,
//           hasPrevPage: pageNumber > 1
//         }
//       }
//     });

//   } catch (error) {
//     console.error('Get orders error:', error);
//     res.status(500).json({ message: 'Server error while retrieving orders' });
//   }
// };

// Controller to update order status
// const updateOrder = async (req, res) => {
//   try {
//     // 1. Verify admin authentication
//     const token = req.cookies.adminToken;
//     if (!token) {
//       return res.status(401).json({ message: 'Authentication required.' });
//     }

//     const decoded = verifyToken(token);
//     if (!decoded || decoded.role !== 'admin') {
//       return res.status(403).json({ message: 'Admin access required.' });
//     }

//     // 2. Get order ID and update data
//     const { id } = req.params;
//     const { status, notes } = req.body;

//     // 3. Validate order ID
//     if (!id) {
//       return res.status(400).json({ message: 'Order ID is required.' });
//     }

//     // 4. Validate status
//     const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
//     if (status && !validStatuses.includes(status)) {
//       return res.status(400).json({
//         message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}`
//       });
//     }

//     // 5. Build update object
//     const updateData = {};
//     if (status) updateData.status = status;
//     if (notes !== undefined) updateData.adminNotes = notes;

//     // 6. Update the order
//     const Order = require('../models/orderModel');
//     const updatedOrder = await Order.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true, runValidators: true }
//     ).populate('user', 'name email phone')
//      .populate('items.product', 'name price images');

//     if (!updatedOrder) {
//       return res.status(404).json({ message: 'Order not found.' });
//     }

//     res.status(200).json({
//       message: 'Order updated successfully',
//       data: updatedOrder
//     });

//   } catch (error) {
//     console.error('Update order error:', error);
//     res.status(500).json({ message: 'Server error while updating order' });
//   }
// };

module.exports = {
  login,
  me,
  logout,
  changePassword,
  // dashboard,
  // getOrders,
  // updateOrder
};
