"use client";

import React, { useState } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  productId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline";
  showQuantitySelector?: boolean;
  disabled?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  className = "",
  size = "md",
  variant = "primary",
  showQuantitySelector = false,
  disabled = false,
}) => {
  const { addToCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }
    setIsAdding(true);
    await addToCart(productId, quantity);
    setIsAdding(false);
  };

  const incrementQuantity = () => setQuantity((prev) => Math.min(prev + 1, 10));
  const decrementQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1));

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  // Variant classes
  const variantClasses = {
    primary:
      "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-md",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    outline:
      "bg-white text-amber-600 border-2 border-amber-500 hover:bg-amber-50",
  };

  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex items-center space-x-2 w-full">
      {showQuantitySelector && (
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1 || disabled}
            className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>
          <span className="px-2 py-1 text-sm font-medium min-w-[2rem] text-center">
            {quantity}
          </span>
          <button
            onClick={incrementQuantity}
            disabled={quantity >= 10 || disabled}
            className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={disabled || loading || isAdding}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      >
        {isAdding ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Adding...
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4 mr-2" />
            {showQuantitySelector ? `Add ${quantity} to Cart` : "Add to Cart"}
          </>
        )}
      </button>
    </div>
  );
};

export default AddToCartButton;
