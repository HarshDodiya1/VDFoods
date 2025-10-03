const mongoose = require("mongoose");

/* =========================
   5. ORDER SCHEMA (Enhanced)
========================= */
// const orderSchema = new mongoose.Schema(
//   {
//     orderNumber: { type: String, unique: true }, // Human-readable order number
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

//     items: [
//       {
//         product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//         name: String, // Store product name at time of order
//         quantity: Number,
//         price: Number, // Price at time of order
//         total: Number,
//       },
//     ],

//     // Pricing
//     subtotal: { type: Number, required: true },
//     shippingCost: { type: Number, default: 0 },
//     tax: { type: Number, default: 0 },
//     discount: { type: Number, default: 0 },
//     totalAmount: { type: Number, required: true },

//     // Shipping Address
//     shippingAddress: {
//       name: String,
//       phone: String,
//       street: String,
//       city: String,
//       state: String,
//       zipCode: String,
//       country: String,
//     },

//     // Payment
//     paymentStatus: {
//       type: String,
//       enum: ["pending", "paid", "failed", "refunded"],
//       default: "pending",
//     },
//     paymentMethod: {
//       type: String,
//       enum: ["razorpay", "cod"],
//       default: "razorpay",
//     },
//     paymentId: String, // Razorpay payment ID

//     // Order Status
//     orderStatus: {
//       type: String,
//       enum: [
//         "pending",
//         "confirmed",
//         "processing",
//         "shipped",
//         "delivered",
//         "cancelled",
//       ],
//       default: "pending",
//     },

//     // Tracking
//     trackingNumber: String,
//     estimatedDelivery: Date,
//     deliveredAt: Date,

//     // Notes
//     customerNotes: String,
//     adminNotes: String,
//   },
//   { timestamps: true },
// );

// module.exports = mongoose.model("Order", orderSchema);



/* =========================
   5. ORDER SCHEMA (Enhanced for Razorpay)
========================= */
const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true }, // Human-readable order number
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String, // Store product name at time of order
        quantity: Number,
        price: Number, // Price at time of order
        total: Number,
      },
    ],

    // Pricing
    // subtotal: { type: Number, required: true },
    // shippingCost: { type: Number, default: 0 },
    // tax: { type: Number, default: 0 },
    // discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    // Shipping Address
    shippingAddress: {
      name: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },

    // Payment - Enhanced for Razorpay
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "partially_refunded"],
      default: "pending",
    },
    // paymentMethod: {
    //   type: String,
    //   enum: ["razorpay", "cod"],
    //   default: "razorpay",
    // },
    
    // Razorpay specific fields
    razorpayOrderId: String,    // Razorpay order ID
    razorpayPaymentId: String,  // Razorpay payment ID
    razorpaySignature: String,  // Razorpay signature for verification
    paymentAttempts: { type: Number, default: 0 },
    
    // Payment failure tracking
    // paymentFailureReason: String,
    // paymentLogs: [
    //   {
    //     status: String,
    //     timestamp: { type: Date, default: Date.now },
    //     gatewayResponse: mongoose.Schema.Types.Mixed,
    //   }
    // ],

    // Order Status
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing", 
        "shipped",
        "delivered",
        "cancelled",
        "payment_failed"
      ],
      default: "pending",
    },

    // Tracking
    // trackingNumber: String,
    estimatedDelivery: Date,
    deliveredAt: Date,

    // Notes
    // customerNotes: String,
    adminNotes: String,

    // Timestamps for different stages
    confirmedAt: Date,
    shippedAt: Date,
    cancelledAt: Date,
  },
  { timestamps: true },
);

// Generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD${Date.now()}${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);