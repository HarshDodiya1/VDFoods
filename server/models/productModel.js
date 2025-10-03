const mongoose = require("mongoose");

/* =========================
   3. PRODUCT SCHEMA (Updated to match frontend)
========================= */
const productSchema = new mongoose.Schema(
  {
    // Basic info
    title: { type: String, required: true }, // Changed from 'name' to 'title'
    slug: { type: String, unique: true }, // URL-friendly name
    description: String, // For product cards
    price: { type: String, required: true }, // Changed to String to store "₹299" format
    oldPrice: String, // Changed from 'originalPrice' to 'oldPrice'
    image: { type: String, required: true }, // Main product image
    images: [String], // Array of additional images
    category: {
      type: String,
      required: true,
      enum: ["Spices", "Grains", "Pulses", "Flours", "Herbs", "Powders"], // Your categories
    },
    badge: String, // e.g., "Best Seller", "New", "Sale"
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    tags: [String], // e.g., ["organic", "premium", "ground"]
    weight: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
// const productSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     slug: { type: String, unique: true }, // URL-friendly name
//     description: { type: String, required: true },
//     shortDescription: String, // For product cards

//     // Pricing
//     price: { type: Number, required: true },
//     originalPrice: Number, // For discount display
//     discount: { type: Number, default: 0 }, // Percentage

//     // Images
//     images: [String],

//     // Category and organization
//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       required: true,
//     },
//     tags: [String], // e.g., ["organic", "premium", "ground"]
//     weight: String, // e.g., "100g", "250g", "1kg"
//   },
//   { timestamps: true },
// );

// module.exports = mongoose.model("Product", productSchema);

// categories: spices, grains, pulses, flours, herbs, powders

// {
//     id: 1,
//     title: "Premium Turmeric Powder",
//     description:
//       "Freshly ground turmeric powder sourced directly from farms for authentic taste and maximum health benefits. Rich in curcumin, this premium quality turmeric is perfect for cooking and traditional remedies.",
//     price: "₹299",
//     oldPrice: "₹399",
//     badge: "Best Seller",
//     image:
//       "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
//     rating: 4.8,
//     reviews: 124,
//     category: "Powders",
//     images: [
//       "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
//       "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=300&fit=crop",
//       "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=300&fit=crop",
//       "https://images.unsplash.com/photo-1609501676725-7186f496e96a?w=400&h=300&fit=crop",
//     ],
//   },
