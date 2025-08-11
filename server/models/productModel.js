const mongoose = require("mongoose");

/* =========================
   3. PRODUCT SCHEMA
========================= */
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true }, // URL-friendly name
    description: { type: String, required: true },
    shortDescription: String, // For product cards

    // Pricing
    price: { type: Number, required: true },
    originalPrice: Number, // For discount display
    discount: { type: Number, default: 0 }, // Percentage

    // Images
    images: [String],

    // Category and organization
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: [String], // e.g., ["organic", "premium", "ground"]

    weight: String, // e.g., "100g", "250g", "1kg"

    // Product status
    // metaTitle: String,
    // metaDescription: String,

    // Additional spice-specific fields
    // origin: String, // Country/region of origin
    // spiceType: { type: String, enum: ["whole", "ground", "blend"] },
    // spiciness: { type: String, enum: ["mild", "medium", "hot", "very_hot"] },

    // Admin fields
    // addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
