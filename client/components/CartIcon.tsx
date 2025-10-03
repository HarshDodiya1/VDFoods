"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const CartIcon: React.FC = () => {
  const { cartItemCount, toggleCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 text-gray-600 hover:text-amber-600 transition-colors duration-200"
      aria-label="Open cart"
    >
      <ShoppingCart className="w-6 h-6" />
      {cartItemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {cartItemCount > 99 ? "99+" : cartItemCount}
        </span>
      )}
    </button>
  );
};

export default CartIcon;
