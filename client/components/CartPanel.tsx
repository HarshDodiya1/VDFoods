"use client";

import React from "react";
import { useCart } from "../context/CartContext";
import { X, Plus, Minus, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CartPanel: React.FC = () => {
  const {
    cart,
    cartItemCount,
    cartTotal,
    loading,
    isCartOpen,
    closeCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  } = useCart();

  const handleQuantityChange = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 0) return;
    await updateCartItem(productId, newQuantity);
  };

  const handleRemoveItem = async (productId: string) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    if (
      window.confirm("Are you sure you want to clear all items from your cart?")
    ) {
      await clearCart();
    }
  };

  const formatPrice = (price: number | string) => {
    // Parse string price to number if needed
    let numericPrice = 0;
    if (typeof price === "string") {
      // Remove currency symbol and parse
      const cleanPrice = price.replace(/[₹,\s]/g, "");
      numericPrice = parseFloat(cleanPrice) || 0;
    } else {
      numericPrice = price || 0;
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(numericPrice);
  };

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-80 z-40 transition-opacity duration-300"
          onClick={closeCart}
        />
      )}

      {/* Cart Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md sm:w-96 md:w-[420px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Your Cart ({cartItemCount})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-[calc(100vh-80px)]">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
              <p className="text-gray-400 text-sm text-center mb-6">
                Add some delicious products to get started!
              </p>
              <button
                onClick={closeCart}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              {/* ADDED: Scrollbar hiding classes here */}
              <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div
                      key={item.product._id}
                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      {/* Product Image */}
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={
                            item.product.image ||
                            item.product.images?.[0] ||
                            "/placeholder.jpg"
                          }
                          alt={item.product.title || "Product"}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                          {item.product.title || "Product Name"}
                        </h3>
                        <p className="text-xs text-gray-500 mb-1">
                          {item.product.weight || "100g"}
                        </p>
                        <p className="text-sm font-semibold text-amber-600">
                          {formatPrice(item.priceAtTime)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatPrice(item.priceAtTime)} × {item.quantity}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-center space-y-2 flex-shrink-0">
                        <div className="flex items-center space-x-1 bg-white border border-gray-300 rounded-md">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product._id,
                                item.quantity - 1
                              )
                            }
                            disabled={loading}
                            className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="w-3 h-3 text-gray-600" />
                          </button>
                          <span className="px-2 py-1 text-sm font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product._id,
                                item.quantity + 1
                              )
                            }
                            disabled={loading}
                            className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus className="w-3 h-3 text-gray-600" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.product._id)}
                          disabled={loading}
                          className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Footer */}
              <div className="border-t border-gray-200 p-4 space-y-3 bg-gray-50 flex-shrink-0">
                {/* Clear Cart Button */}
                {cart.items.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    disabled={loading}
                    className="w-full text-sm text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Clear All Items
                  </button>
                )}

                {/* Total */}
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span className="text-gray-800">Total:</span>
                  <span className="text-amber-600">
                    {formatPrice(cartTotal)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Link href="/products" onClick={closeCart}>
                    <button className="w-full py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium mb-2">
                      Shop More
                    </button>
                  </Link>
                  <Link href="/checkout" onClick={closeCart}>
                    <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-medium shadow-md">
                      Proceed to Checkout
                    </button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPanel;
