"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import ApiService, { Cart, CartItem, Product } from "../utils/api";
import { useAuth } from "./AuthContext";
import { toast } from "react-hot-toast";

interface CartResult {
  success: boolean;
  data?: any;
  error?: string;
}

interface CartContextType {
  cart: Cart | null;
  cartItemCount: number;
  cartTotal: number;
  loading: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (productId: string, quantity?: number) => Promise<CartResult>;
  updateCartItem: (productId: string, quantity: number) => Promise<CartResult>;
  removeFromCart: (productId: string) => Promise<CartResult>;
  clearCart: () => Promise<CartResult>;
  refreshCart: () => Promise<void>;
}

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Start with true to indicate initial loading
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Helper function to parse price
  const parsePrice = (price: string | number): number => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      const cleanPrice = price.replace(/[₹,\s]/g, '');
      return parseFloat(cleanPrice) || 0;
    }
    return 0;
  };

  // Computed values
  const cartItemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;
  
  // Calculate total from individual items if cart.totalAmount is unreliable
  const cartTotal = cart?.items.reduce((total, item) => {
    const itemPrice = parsePrice(item.priceAtTime);
    return total + (itemPrice * item.quantity);
  }, 0) || 0;

  // Cart panel controls
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  // Fetch cart data when user is authenticated
  const refreshCart = async (): Promise<void> => {
    if (!isAuthenticated || !user) {
      setCart(null);
      setLoading(false); // Set loading to false when not authenticated
      return;
    }

    try {
      setLoading(true);
      const response = await ApiService.getCart();
      setCart(response.data || null);
    } catch (error) {
      console.error("Error fetching cart:", error);
      // Don't show error toast for cart fetch failures
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  // Initialize cart when auth state changes
  useEffect(() => {
    refreshCart();
  }, [isAuthenticated, user]);

  const addToCart = async (
    productId: string,
    quantity: number = 1
  ): Promise<CartResult> => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return { success: false, error: "User not authenticated" };
    }

    try {
      setLoading(true);
      const response = await ApiService.addToCart(productId, quantity);
      
      // Refresh cart data
      await refreshCart();
      
      // Open cart panel to show the added item
      openCart();
      
      toast.success("Item added to cart successfully!");
      
      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add item to cart";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (
    productId: string,
    quantity: number
  ): Promise<CartResult> => {
    if (!isAuthenticated) {
      return { success: false, error: "User not authenticated" };
    }

    try {
      setLoading(true);
      const response = await ApiService.updateCartItem(productId, quantity);
      
      // Refresh cart data
      await refreshCart();
      
      if (quantity === 0) {
        toast.success("Item removed from cart");
      } else {
        toast.success("Cart updated successfully");
      }
      
      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update cart";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string): Promise<CartResult> => {
    if (!isAuthenticated) {
      return { success: false, error: "User not authenticated" };
    }

    try {
      setLoading(true);
      const response = await ApiService.removeFromCart(productId);
      
      // Refresh cart data
      await refreshCart();
      
      toast.success("Item removed from cart");
      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to remove item";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async (): Promise<CartResult> => {
    if (!isAuthenticated) {
      return { success: false, error: "User not authenticated" };
    }

    try {
      setLoading(true);
      const response = await ApiService.clearCart();
      
      // Refresh cart data
      await refreshCart();
      
      toast.success("Cart cleared successfully");
      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to clear cart";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const value: CartContextType = {
    cart,
    cartItemCount,
    cartTotal,
    loading,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
