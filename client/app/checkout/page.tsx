"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, CreditCard, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NavbarDemo } from "../../components/navbar";
import ApiService, { ShippingAddress, CartItem } from "../../utils/api";

export const dynamic = "force-dynamic";

type CheckoutStep = "address" | "payment" | "confirmation";

const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, loading: cartLoading } = useCart();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("address");
  const [loading, setLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: user?.name || "",
    phone: user?.phone || "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });
  const [addressErrors, setAddressErrors] = useState<Partial<ShippingAddress>>(
    {}
  );
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    // Only run validation after both auth and cart have finished their initial loading
    if (authLoading || cartLoading) return;

    // Mark as initialized after first complete load
    if (!hasInitialized) {
      setHasInitialized(true);
    }

    // Check authentication
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    // Only redirect if we've initialized and cart is confirmed empty
    // This prevents redirects during the initial loading phase
    if (hasInitialized && (!cart || !cart.items || cart.items.length === 0)) {
      router.push("/products");
      return;
    }
  }, [isAuthenticated, authLoading, cart, cartLoading, router, hasInitialized]);

  // Update shipping address when user data is loaded
  useEffect(() => {
    if (user && !authLoading) {
      setShippingAddress((prev) => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user, authLoading]);

  const validateAddress = (): boolean => {
    const errors: Partial<ShippingAddress> = {};

    if (!shippingAddress.name.trim()) errors.name = "Name is required";
    if (!shippingAddress.phone.trim()) errors.phone = "Phone is required";
    if (!shippingAddress.street.trim())
      errors.street = "Street address is required";
    if (!shippingAddress.city.trim()) errors.city = "City is required";
    if (!shippingAddress.state.trim()) errors.state = "State is required";
    if (!shippingAddress.zipCode.trim())
      errors.zipCode = "ZIP code is required";

    // Phone validation
    const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
    if (shippingAddress.phone && !phoneRegex.test(shippingAddress.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    // ZIP code validation
    const zipRegex = /^\d{6}$/;
    if (shippingAddress.zipCode && !zipRegex.test(shippingAddress.zipCode)) {
      errors.zipCode = "Please enter a valid 6-digit ZIP code";
    }

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddressSubmit = async () => {
    if (!validateAddress()) return;

    setLoading(true);
    try {
      const response = await ApiService.createOrder(shippingAddress);
      setOrderData(response.order);
      setCurrentStep("payment");
    } catch (error: any) {
      console.error("Failed to create order:", error);
      alert(error.message || "Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number | string) => {
    let numericPrice = 0;
    if (typeof price === "string") {
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

  // Show loading spinner while contexts are loading or during initialization
  if (authLoading || cartLoading || !hasInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  // Only show loading if we're sure the user is not authenticated or cart is empty
  if (!isAuthenticated || !cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <NavbarDemo /> */}

      <div className="max-w-6xl mx-auto px-4 py-8 pt-18">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/products">
              <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-2 ${
                currentStep === "address"
                  ? "text-amber-600"
                  : currentStep === "payment" || currentStep === "confirmation"
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              {currentStep === "payment" || currentStep === "confirmation" ? (
                <Check className="w-5 h-5" />
              ) : (
                <MapPin className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">Address</span>
            </div>
            <div
              className={`flex items-center space-x-2 ${
                currentStep === "payment"
                  ? "text-amber-600"
                  : currentStep === "confirmation"
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              {currentStep === "confirmation" ? (
                <Check className="w-5 h-5" />
              ) : (
                <CreditCard className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === "address" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Shipping Address
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.name}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          name: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        addressErrors.name
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter your full name"
                    />
                    {addressErrors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {addressErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          phone: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        addressErrors.phone
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="+91-9876543210"
                    />
                    {addressErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {addressErrors.phone}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.street}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          street: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        addressErrors.street
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="House number, street name"
                    />
                    {addressErrors.street && (
                      <p className="text-red-500 text-xs mt-1">
                        {addressErrors.street}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          city: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        addressErrors.city
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter city"
                    />
                    {addressErrors.city && (
                      <p className="text-red-500 text-xs mt-1">
                        {addressErrors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          state: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        addressErrors.state
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter state"
                    />
                    {addressErrors.state && (
                      <p className="text-red-500 text-xs mt-1">
                        {addressErrors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.zipCode}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          zipCode: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        addressErrors.zipCode
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="400001"
                    />
                    {addressErrors.zipCode && (
                      <p className="text-red-500 text-xs mt-1">
                        {addressErrors.zipCode}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.country}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          country: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="India"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleAddressSubmit}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Processing..." : "Continue to Payment"}
                  </button>
                </div>
              </div>
            )}

            {currentStep === "payment" && orderData && (
              <PaymentComponent
                orderData={orderData}
                onSuccess={() => setCurrentStep("confirmation")}
                onFailure={() => setCurrentStep("address")}
              />
            )}

            {currentStep === "confirmation" && (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Order Confirmed!
                </h2>
                <p className="text-gray-600 mb-4">
                  Thank you for your purchase. Your order has been confirmed.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  You will receive an email confirmation shortly.
                </p>
                <Link href="/orders">
                  <button className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                    View Order Details
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 mb-4">
                {cart.items.map((item: CartItem) => (
                  <div
                    key={item.product._id}
                    className="flex items-center space-x-3"
                  >
                    <div className="relative w-12 h-12 flex-shrink-0">
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
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">
                        {item.product.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      {formatPrice(item.priceAtTime)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span className="text-gray-800">Total:</span>
                  <span className="text-amber-600">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Payment Component
const PaymentComponent: React.FC<{
  orderData: any;
  onSuccess: () => void;
  onFailure: () => void;
}> = ({ orderData, onSuccess, onFailure }) => {
  const [loading, setLoading] = useState(false);
  const [razorpayKey, setRazorpayKey] = useState<string>("");

  useEffect(() => {
    const getRazorpayKey = async () => {
      try {
        const response = await ApiService.getRazorpayKey();
        setRazorpayKey(response.key);
      } catch (error) {
        console.error("Failed to get Razorpay key:", error);
      }
    };

    getRazorpayKey();
  }, []);

  const handlePayment = async () => {
    if (!razorpayKey) {
      alert("Payment system not configured. Please try again.");
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay SDK
      const res = await loadRazorpaySDK();
      if (!res) {
        alert(
          "Razorpay SDK failed to load. Please check your internet connection."
        );
        return;
      }

      const options = {
        key: razorpayKey,
        amount: orderData.razorpayOrder.amount,
        currency: orderData.razorpayOrder.currency,
        name: "VD Foods",
        description: `Order #${orderData.orderNumber}`,
        order_id: orderData.razorpayOrder.id,
        handler: async (response: any) => {
          try {
            await ApiService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderData.orderId,
            });
            onSuccess();
          } catch (error: any) {
            console.error("Payment verification failed:", error);
            alert("Payment verification failed. Please contact support.");
            onFailure();
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#F59E0B",
        },
        modal: {
          ondismiss: () => {
            ApiService.handlePaymentFailure(orderData.orderId, {
              code: "PAYMENT_CANCELLED",
              description: "Payment was cancelled by user",
            });
            onFailure();
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
      onFailure();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment</h2>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-600 mb-2">Order Number:</p>
        <p className="font-semibold text-gray-800">{orderData.orderNumber}</p>

        <p className="text-sm text-gray-600 mb-2 mt-4">Total Amount:</p>
        <p className="text-xl font-bold text-amber-600">
          ₹{orderData.totalAmount.toFixed(2)}
        </p>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading || !razorpayKey}
        className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        Your payment is secured with 256-bit SSL encryption
      </p>
    </div>
  );
};

// Helper function to load Razorpay SDK
const loadRazorpaySDK = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default CheckoutPage;
