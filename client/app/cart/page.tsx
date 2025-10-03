"use client";

import React from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NavbarDemo } from "../../components/navbar";

export const dynamic = "force-dynamic";

const CartPage: React.FC = () => {
  const {
    cart,
    cartItemCount,
    cartTotal,
    loading,
    updateCartItem,
    removeFromCart,
    clearCart,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

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

  // CORRECTED: Updated formatPrice to handle string inputs with currency symbols
  const formatPrice = (price: number | string) => {
    let numericPrice = 0;
    if (typeof price === "string") {
      // Remove currency symbol and parse to float
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

  if (!isAuthenticated) {
    return (
      <>
        <NavbarDemo />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
          <div className="text-center">
            <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Login Required
            </h1>
            <p className="text-gray-600 mb-8">
              Please login to view your cart and make purchases.
            </p>
            <Link
              href="/auth"
              className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Login Now
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarDemo />
      <div className="min-h-screen bg-gray-50 py-8 pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
                <p className="text-gray-600">
                  {cartItemCount} {cartItemCount === 1 ? "item" : "items"} in
                  your cart
                </p>
              </div>
            </div>

            {cart && cart.items.length > 0 && (
              <button
                onClick={handleClearCart}
                disabled={loading}
                className="text-red-600 hover:text-red-700 bg-red-100 px-2 py-1 rounded-lg font-semibold  disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Clear Cart
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-8" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Discover our delicious products and add them to your cart!
              </p>
              <Link
                href="/products"
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-medium shadow-md"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.product._id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={
                            item.product.image ||
                            item.product.images?.[0] ||
                            "/placeholder.jpg"
                          }
                          alt={item.product.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-800 truncate">
                          {item.product.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {item.product.weight || "N/A"}
                        </p>
                        <p className="text-lg font-bold text-amber-600">
                          {formatPrice(item.priceAtTime)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-center space-y-3">
                        <div className="flex items-center space-x-1 bg-gray-100 border border-gray-300 rounded-md">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.product._id,
                                item.quantity - 1
                              )
                            }
                            disabled={loading}
                            className="p-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="px-4 py-2 text-lg font-medium min-w-[3rem] text-center">
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
                            className="p-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.product._id)}
                          disabled={loading}
                          className="flex items-center space-x-1 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-sm">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Order Summary
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Items ({cartItemCount})
                      </span>
                      <span className="text-gray-900">
                        {formatPrice(cartTotal)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">
                          Total
                        </span>
                        <span className="text-xl font-bold text-amber-600">
                          {formatPrice(cartTotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-medium shadow-md">
                      Proceed to Checkout
                    </button>

                    <Link
                      href="/products"
                      className="block w-full py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium text-center"
                    >
                      Continue Shopping
                    </Link>
                  </div>

                  <div className="mt-4 text-xs text-gray-500 text-center">
                    <p>🔒 Secure checkout guaranteed</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
