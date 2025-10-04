const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const config = require('../config/config.js');

const JWT_SECRET = config.jwtSecret;

// Helper function to verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Middleware to authenticate admin using cookies
const authenticateAdmin = async (req, res, next) => {
  try {
    // 1. Try to get JWT from cookie first, then from Authorization header
    let token = req.cookies.adminToken;
    
    // If no token in cookie, check Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({ message: 'No authentication token found.' });
    }

    // 2. Verify JWT signature
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    // 3. Check if user is admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    // 4. Get user info from database (to ensure user still exists and is active)
    const admin = await User.findById(decoded.userId);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    // 5. Check if admin is still verified and has admin role
    if (admin.role !== 'admin') {
      // Clear the invalid cookie
      res.clearCookie('adminToken');
      return res.status(403).json({ message: 'Admin access revoked.' });
    }

    // 6. Attach admin to request
    req.user = admin;
    req.admin = admin;
    
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({ message: 'Server error in authentication' });
  }
};

module.exports = {
  authenticateAdmin
};