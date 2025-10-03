// routes/orderAdminRoutes.js
const express = require("express");
const router = express.Router();
const orderAdminController = require("../controllers/orderAdminController");
const { authenticateAdmin } = require("../middlewares/adminMiddleware.js");

// All admin routes require authentication
router.use(authenticateAdmin);

// Dashboard & Analytics
router.get("/dashboard", orderAdminController.getDashboard);
router.get("/analytics", orderAdminController.getAnalytics);

// Order Management
router.get("/orders", orderAdminController.getAllOrders);
router.get("/orders/:orderId", orderAdminController.getOrderDetails);
router.put("/orders/:orderId/status", orderAdminController.updateOrderStatus);
router.put("/orders/:orderId/tracking", orderAdminController.updateTrackingInfo);
router.post("/orders/:orderId/refund", orderAdminController.processRefund);
router.get("/orders/status/:status", orderAdminController.getOrdersByStatus);

module.exports = router;