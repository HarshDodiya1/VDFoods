"use client";

import React, { useState, useEffect } from "react";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import { CgLogIn } from "react-icons/cg";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export const dynamic = "force-dynamic";

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface Slide {
  image: string;
}

interface Stat {
  label: string;
  color: string;
}

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Form states
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [showOtpVerification, setShowOtpVerification] =
    useState<boolean>(false);
  const [showPasswordReset, setShowPasswordReset] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  const {
    login,
    register,
    isAuthenticated,
    sendOtp,
    verifyOtp,
    resetPassword,
  } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const slides: Slide[] = [
    { image: "/login.png" },
    { image: "/login2.png" },
    { image: "/login3.png" },
    { image: "/login4.png" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const stats: Stat[] = [
    {
      label: "⚡ Fresh Stock",
      color: "text-purple-600 bg-purple-50 px-2 py-1 rounded-md",
    },
    {
      label: "🚚 Fast Delivery",
      color: "text-green-600 bg-green-50 px-2 py-1 rounded-md",
    },
    {
      label: "🤝 Pure Oils & Spices",
      color: "text-amber-600 bg-amber-50 px-2 py-1 rounded-md",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (isLogin) {
      if (!formData.email || !formData.password) {
        toast.error("Email and password are required");
        return false;
      }
    } else {
      if (
        !formData.name ||
        !formData.email ||
        !formData.phone ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        toast.error("All fields are required");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return false;
      }
      if (formData.password.length < 8) {
        toast.error("Password must be at least 8 characters long");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        const result = await login({
          email: formData.email,
          password: formData.password,
        });

        if (result.success) {
          router.push("/");
        }
      } else {
        const result = await register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });

        if (result.success) {
          // Clear form and switch to login
          setFormData({
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
          });
          setIsLogin(true);
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (): Promise<void> => {
    if (!forgotEmail) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    const result = await sendOtp(forgotEmail);
    setIsLoading(false);

    if (result.success) {
      setShowForgotPassword(false);
      setShowOtpVerification(true);
    }
  };

  const handleOtpVerification = async (): Promise<void> => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    setIsLoading(true);
    const result = await verifyOtp({ email: forgotEmail, otp });
    setIsLoading(false);

    if (result.success) {
      setShowOtpVerification(false);
      setShowPasswordReset(true);
    }
  };

  const handlePasswordReset = async (): Promise<void> => {
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    const result = await resetPassword({ email: forgotEmail, newPassword });
    setIsLoading(false);

    if (result.success) {
      setShowPasswordReset(false);
      setForgotEmail("");
      setOtp("");
      setNewPassword("");
      toast.success(
        "Password reset successful! Please login with your new password."
      );
    }
  };

  const resetForgotPasswordFlow = (): void => {
    setShowForgotPassword(false);
    setShowOtpVerification(false);
    setShowPasswordReset(false);
    setForgotEmail("");
    setOtp("");
    setNewPassword("");
  };

  // Forgot Password Modal
  if (showForgotPassword || showOtpVerification || showPasswordReset) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 ">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          {showForgotPassword && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Forgot Password
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    placeholder="Enter your email"
                  />
                </div>
                <button
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                  className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50"
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </button>
                <button
                  onClick={resetForgotPasswordFlow}
                  className="w-full text-gray-600 hover:text-gray-800"
                >
                  Back to Login
                </button>
              </div>
            </>
          )}

          {showOtpVerification && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Verify OTP
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    placeholder="Enter 4-digit OTP"
                    maxLength={4}
                  />
                </div>
                <button
                  onClick={handleOtpVerification}
                  disabled={isLoading}
                  className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50"
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </button>
                <button
                  onClick={resetForgotPasswordFlow}
                  className="w-full text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </>
          )}

          {showPasswordReset && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Reset Password
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    placeholder="Enter new password"
                  />
                </div>
                <button
                  onClick={handlePasswordReset}
                  disabled={isLoading}
                  className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
                <button
                  onClick={resetForgotPasswordFlow}
                  className="w-full text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden pt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-400 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-yellow-400 rounded-full"></div>
        <div className="absolute top-1/2 left-20 w-50 h-50 bg-green-400 rounded-full"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-purple-400 rounded-full"></div>
        <div className="absolute top-1/2 left-10 w-10 h-10 bg-blue-400 rounded-full"></div>
        <div className="absolute top-20 left-1/3 w-6 h-6 bg-red-400 rounded-full"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto">
          {/* Main Container */}
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden min-h-[600px] mb-16">
            <div className="flex flex-col lg:flex-row min-h-[600px]">
              {/* Left Side - 40% */}
              <div
                className="lg:w-2/5 p-8 flex flex-col justify-center relative"
                style={{
                  backgroundColor: "#ffecb3",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='12' viewBox='0 0 40 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6.172L6.172 0h5.656L0 11.828V6.172zm40 5.656L28.172 0h5.656L40 6.172v5.656zM6.172 12l12-12h3.656l12 12h-5.656L20 3.828 11.828 12H6.172zm12 0L20 10.172 21.828 12h-3.656z' fill='%23ffc107' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                  borderRadius: "0px",
                  border: "1px solid rgba(255, 193, 7, 0.2)",
                }}
              >
                {/* Image Slider */}
                <div className="mb-8 relative">
                  <div className="w-full h-80 mx-auto overflow-hidden relative">
                    <div className="relative w-full h-full">
                      <img
                        src={slides[currentSlide].image}
                        alt={`Slide ${currentSlide + 1}`}
                        className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-center text-gray-700">
                  <h2 className="text-3xl font-bold mb-4">
                    Unlock Flavourful Benefits
                  </h2>
                  <p className="text-lg opacity-90">
                    Enjoy exclusive offers and the freshest spices & oils, only
                    for our members
                  </p>
                </div>
              </div>

              {/* Right Side - 60% */}
              <div className="lg:w-3/5 p-4 lg:p-8 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                  <div className="mb-2">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center">
                      Welcome {isLogin ? "back" : ""} to VD FOODS 👋
                    </h1>
                    <p className="text-gray-600">
                      {isLogin
                        ? "Sign in to keep exploring VD Foods"
                        : "Join now to taste VD Foods"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {stats.map((stat, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 whitespace-nowrap"
                      >
                        <span className={`text-xs font-medium ${stat.color}`}>
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div
                      className={`space-y-4 ${
                        !isLogin ? "max-h-80 overflow-y-auto p-2" : ""
                      }`}
                    >
                      {!isLogin && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600 w-5 h-5" />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                              placeholder="Enter your full name"
                              required={!isLogin}
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 w-5 h-5" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                      </div>

                      {!isLogin && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600 w-5 h-5" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                              placeholder="Enter your phone number"
                              required={!isLogin}
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                            placeholder="Enter your password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {!isLogin && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 w-5 h-5" />
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                              placeholder="Confirm your password"
                              required={!isLogin}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {isLogin && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="remember"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <label
                            htmlFor="remember"
                            className="ml-2 text-sm text-gray-700"
                          >
                            Remember me
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-amber-700 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>
                        {isLoading
                          ? isLogin
                            ? "Signing in..."
                            : "Creating account..."
                          : isLogin
                          ? "Sign in"
                          : "Create account"}
                      </span>
                      {!isLoading && <CgLogIn className="w-5 h-5" />}
                    </button>

                    <div className="text-center">
                      <span className="text-gray-600">
                        {isLogin
                          ? "New to VD FOODS? "
                          : "Already have an account? "}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsLogin(!isLogin);
                          setFormData({
                            name: "",
                            email: "",
                            phone: "",
                            password: "",
                            confirmPassword: "",
                          });
                        }}
                        className="text-orange-600 hover:text-orange-700 font-medium"
                      >
                        {isLogin ? "Create an account" : "Sign in"} →
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
