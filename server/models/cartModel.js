const mongoose = require("mongoose");

/* =========================
   4. CART SCHEMA
========================= */
const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1, min: 1 },
        priceAtTime: String, // Store price when added to cart
      },
    ],
    totalAmount: { type: Number, default: 0 },
    expiresAt: { type: Date, default: Date.now, expires: "7d" }, // Auto-delete old carts
  },
  { timestamps: true },
);

module.exports = mongoose.model("Cart", cartSchema);