const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* =========================
   ORDER CONTROLLERS
========================= */

// Step 1: Create Order
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const { user } = req.body;
    const userId = user.id;
    // const userId = req.user.id;
    // console.log("this is we are getting from req.body", shippingAddress, userId);
    // Validate user ID

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Validate shipping address
    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zipCode
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required",
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // console.log("this is what we find in cart:", cart);

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = cart.items.map((item) => {
      // Clean price string (remove currency symbols, commas, spaces, etc.)
      const cleanPrice = Number(
        String(item.priceAtTime).replace(/[^\d.-]/g, ""),
      );

      if (isNaN(cleanPrice)) {
        throw new Error(
          `Invalid price found for product ${item.product?.title}`,
        );
      }

      const itemTotal = cleanPrice * item.quantity;
      totalAmount += itemTotal;

      return {
        product: item.product._id,
        name: item.product.title,
        quantity: item.quantity,
        price: cleanPrice,
        total: itemTotal,
      };
    });

    // console.log("This is what orderItems is giving us: ", orderItems);

    // Create order in database
    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount: Math.round(totalAmount * 100) / 100, // Round to 2 decimal places
      shippingAddress: {
        name: shippingAddress.name,
        phone: shippingAddress.phone,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country || "India",
      },
      orderStatus: "pending",
      paymentStatus: "pending",
    });

    await order.save();

    // Create Razorpay order
    const options = {
      amount: Math.round(order.totalAmount * 100), // Convert to paise
      currency: "INR",
      receipt: order.orderNumber,
      notes: {
        orderId: order._id.toString(),
        userId: userId,
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Update order with Razorpay order ID
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    // Clear cart after order creation
    await Cart.findOneAndUpdate(
      { user: userId },
      { items: [], totalAmount: 0 },
    );

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        razorpayOrder: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
        },
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// Step 2: Verify Payment
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // Validate required fields
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment verification data",
      });
    }

    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      // Invalid signature - mark payment as failed
      order.paymentStatus = "failed";
      order.orderStatus = "payment_failed";
      order.paymentAttempts += 1;
      await order.save();

      return res.status(400).json({
        success: false,
        message: "Payment verification failed - Invalid signature",
      });
    }

    // Payment verified successfully
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.confirmedAt = new Date();

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        confirmedAt: order.confirmedAt,
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

// Step 3: Handle Payment Failure
exports.handlePaymentFailure = async (req, res) => {
  try {
    const { orderId, error } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.paymentStatus = "failed";
    order.orderStatus = "payment_failed";
    order.paymentAttempts += 1;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment failure recorded",
      order: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
      },
    });
  } catch (error) {
    console.error("Payment failure handling error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to handle payment failure",
      error: error.message,
    });
  }
};

// Get Razorpay key for frontend
exports.getRazorpayKey = (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID) {
      return res.status(500).json({
        success: false,
        message: "Razorpay key not configured",
      });
    }

    res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get Razorpay key",
    });
  }
};

// Webhook handler for payment notifications
exports.webhookHandler = (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.log("Webhook secret not configured");
      return res.status(200).json({ status: "ok" });
    }

    const receivedSignature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (receivedSignature === expectedSignature) {
      // Process webhook event
      const event = req.body;
      console.log("Webhook event received:", event.event);

      // Handle different webhook events
      switch (event.event) {
        case "payment.captured":
          console.log("Payment captured:", event.payload.payment.entity.id);
          break;
        case "payment.failed":
          console.log("Payment failed:", event.payload.payment.entity.id);
          break;
        default:
          console.log("Unhandled webhook event:", event.event);
      }
    }

    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: userId })
      .populate("items.product", "title price image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-razorpaySignature"); // Exclude sensitive data

    const totalOrders = await Order.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNextPage: page < Math.ceil(totalOrders / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// Get order details
exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    })
      .populate("items.product", "title price image description")
      .select("-razorpaySignature"); // Exclude sensitive data

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order details error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order details",
      error: error.message,
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order can be cancelled
    if (!["pending", "confirmed"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled. Current status: ${order.orderStatus}`,
      });
    }

    // Update order status
    order.orderStatus = "cancelled";
    order.cancelledAt = new Date();

    // If payment was made, mark for refund
    if (order.paymentStatus === "paid") {
      order.paymentStatus = "refunded";
      // TODO: Implement actual refund logic with Razorpay
      console.log(
        `Refund required for order ${order.orderNumber}, payment ID: ${order.razorpayPaymentId}`,
      );
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        cancelledAt: order.cancelledAt,
      },
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    });
  }
};
