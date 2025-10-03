const Cart = require('../models/cartModel.js');
const Product = require('../models/productModel.js');
const mongoose = require('mongoose');

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Helper function to parse price string to number
const parsePriceToNumber = (priceString) => {
  if (typeof priceString === 'number') return priceString;
  if (typeof priceString === 'string') {
    // Remove currency symbol and any non-numeric characters except decimal points
    const numericPrice = priceString.replace(/[₹,\s]/g, '');
    const parsed = parseFloat(numericPrice);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

// Helper function to calculate cart total
const calculateCartTotal = (items) => {
  return items.reduce((total, item) => {
    const price = parsePriceToNumber(item.priceAtTime);
    return total + (price * item.quantity);
  }, 0);
};

// Controller to add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id;

    // 1. Basic validation
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format.' });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be a positive integer.' });
    }

    // 2. Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // 3. Find or create cart for user
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create new cart
      const numericPrice = parsePriceToNumber(product.price);
      cart = new Cart({
        user: userId,
        items: [{
          product: productId,
          quantity: quantity,
          priceAtTime: product.price
        }],
        totalAmount: numericPrice * quantity
      });
    } else {
      // Check if product already exists in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (existingItemIndex > -1) {
        // Update existing item
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].priceAtTime = product.price; // Update price
      } else {
        // Add new item
        cart.items.push({
          product: productId,
          quantity: quantity,
          priceAtTime: product.price
        });
      }

      // Recalculate total
      cart.totalAmount = calculateCartTotal(cart.items);
      
      // Update expiry date
      cart.expiresAt = new Date();
    }

    // 4. Save cart
    const savedCart = await cart.save();

    // 5. Populate cart for response
    await savedCart.populate({
      path: 'items.product',
      select: 'title price oldPrice image images slug category weight badge rating reviews',
      populate: {
        path: 'category',
        select: 'name'
      }
    });

    res.status(200).json({
      message: 'Item added to cart successfully',
      data: savedCart
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error while adding item to cart' });
  }
};

// Controller to get user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find cart for user
    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: 'title price oldPrice image images slug category weight badge rating reviews',
      populate: {
        path: 'category',
        select: 'name'
      }
    });

    if (!cart) {
      return res.status(200).json({
        message: 'Cart is empty',
        data: {
          user: userId,
          items: [],
          totalAmount: 0
        }
      });
    }

    // Filter out items with deleted products
    const validItems = cart.items.filter(item => item.product);
    
    if (validItems.length !== cart.items.length) {
      // Some products were deleted, update cart
      cart.items = validItems;
      cart.totalAmount = calculateCartTotal(validItems);
      await cart.save();
    }

    res.status(200).json({
      message: 'Cart retrieved successfully',
      data: cart
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error while retrieving cart' });
  }
};

// Controller to update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    // 1. Basic validation
    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: 'Product ID and quantity are required.' });
    }

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format.' });
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      return res.status(400).json({ message: 'Quantity must be a non-negative integer.' });
    }

    // 2. Find cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    // 3. Find item in cart
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart.' });
    }

    // 4. Update quantity or remove item
    if (quantity === 0) {
      // Remove item from cart
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
      
      // Update price (in case product price changed)
      const product = await Product.findById(productId);
      if (product) {
        cart.items[itemIndex].priceAtTime = product.price;
      }
    }

    // 5. Recalculate total and update expiry
    cart.totalAmount = calculateCartTotal(cart.items);
    cart.expiresAt = new Date();

    // 6. Save cart
    const savedCart = await cart.save();

    // 7. Populate cart for response
    await savedCart.populate({
      path: 'items.product',
      select: 'title price oldPrice image images slug category weight badge rating reviews',
      populate: {
        path: 'category',
        select: 'name'
      }
    });

    res.status(200).json({
      message: quantity === 0 ? 'Item removed from cart successfully' : 'Cart item updated successfully',
      data: savedCart
    });

  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ message: 'Server error while updating cart item' });
  }
};

// Controller to remove specific item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    // 1. Basic validation
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format.' });
    }

    // 2. Find cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    // 3. Find and remove item
    const initialItemCount = cart.items.length;
    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    if (cart.items.length === initialItemCount) {
      return res.status(404).json({ message: 'Product not found in cart.' });
    }

    // 4. Recalculate total and update expiry
    cart.totalAmount = calculateCartTotal(cart.items);
    cart.expiresAt = new Date();

    // 5. Save cart
    const savedCart = await cart.save();

    // 6. Populate cart for response
    await savedCart.populate({
      path: 'items.product',
      select: 'title price oldPrice image images slug category weight badge rating reviews',
      populate: {
        path: 'category',
        select: 'name'
      }
    });

    res.status(200).json({
      message: 'Item removed from cart successfully',
      data: savedCart
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error while removing item from cart' });
  }
};

// Controller to clear entire cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find and clear cart
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      return res.status(200).json({
        message: 'Cart is already empty',
        data: {
          user: userId,
          items: [],
          totalAmount: 0
        }
      });
    }

    // Clear cart items
    cart.items = [];
    cart.totalAmount = 0;
    cart.expiresAt = new Date();

    const savedCart = await cart.save();

    res.status(200).json({
      message: 'Cart cleared successfully',
      data: savedCart
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error while clearing cart' });
  }
};

// Controller to get cart item count (useful for cart badge)
const getCartItemCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    
    const itemCount = cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;

    res.status(200).json({
      message: 'Cart item count retrieved successfully',
      data: {
        itemCount,
        totalAmount: cart ? cart.totalAmount : 0
      }
    });

  } catch (error) {
    console.error('Get cart item count error:', error);
    res.status(500).json({ message: 'Server error while getting cart item count' });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartItemCount
};