// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController.js");
const { authenticateToken } = require("../middlewares/middleware.js");

// Step 1: Create order and Razorpay order (requires auth)
router.post("/create-order", authenticateToken, orderController.createOrder);

// Step 2: Verify payment after successful payment (requires auth)
router.post("/verify-payment", authenticateToken, orderController.verifyPayment);

// Step 3: Handle payment failure (requires auth)
router.post("/payment-failed", authenticateToken, orderController.handlePaymentFailure);

// Get Razorpay key for frontend (no auth required)
router.get("/razorpay-key", orderController.getRazorpayKey);

// Webhook for payment notifications (no auth required)
router.post("/webhook", orderController.webhookHandler);

// Order management routes (require auth)
router.get("/orders", authenticateToken, orderController.getUserOrders);
router.get("/orders/:orderId", authenticateToken, orderController.getOrderDetails);
router.post("/orders/:orderId/cancel", authenticateToken, orderController.cancelOrder);

module.exports = router;