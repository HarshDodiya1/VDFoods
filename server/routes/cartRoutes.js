const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController.js");
const { authenticateToken } = require("../middlewares/middleware.js");

// Apply authentication middleware to all cart routes
router.use(authenticateToken);

// Cart routes
router.post("/add", cartController.addToCart);                    // Add item to cart
router.get("/", cartController.getCart);                         // Get user's cart
router.get("/count", cartController.getCartItemCount);           // Get cart item count
router.put("/update", cartController.updateCartItem);            // Update item quantity
router.delete("/item/:productId", cartController.removeFromCart); // Remove specific item
router.delete("/clear", cartController.clearCart);               // Clear entire cart

module.exports = router;