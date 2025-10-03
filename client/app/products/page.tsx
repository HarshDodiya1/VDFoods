"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Grid3X3,
  LayoutGrid,
  Star,
  ShoppingCart,
  SlidersHorizontal,
  X,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import apiService, { Product as ApiProduct } from "../../utils/api";
import AddToCartButton from "../../components/AddToCartButton";

export const dynamic = "force-dynamic";

interface Product extends Omit<ApiProduct, "_id"> {
  id: string;
}

export default function SpicesProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getAllProducts();

        // Transform backend data to frontend format
        const transformedProducts: Product[] = response.data.products.map(
          (product) => ({
            ...product,
            id: product._id,
            oldPrice: product.oldPrice || "",
            badge: product.badge || "",
            images: product.images || [product.image],
            tags: product.tags || [],
          })
        );

        setProducts(transformedProducts);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    "All",
    "Spices",
    "Grains",
    "Pulses",
    "Flours",
    "Herbs",
    "Powders",
  ];
  const sortOptions = [
    { label: "Featured", value: "featured" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Top Rated", value: "rating" },
    { label: "Newest", value: "newest" },
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Best Seller":
        return "bg-gradient-to-r from-amber-400 to-orange-500";
      case "Hot Deal":
        return "bg-gradient-to-r from-red-500 to-pink-500";
      case "New":
        return "bg-gradient-to-r from-green-400 to-emerald-500";
      case "Popular":
        return "bg-gradient-to-r from-blue-500 to-indigo-500";
      case "Trending":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "Premium":
        return "bg-gradient-to-r from-gray-700 to-gray-900";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  // Disable body scroll when modal is open
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProduct]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Enhanced search - includes all product parameters
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm === "" ||
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        (product.badge && product.badge.toLowerCase().includes(searchLower)) ||
        (product.tags &&
          product.tags.some((tag) =>
            tag.toLowerCase().includes(searchLower)
          )) ||
        (product.weight &&
          product.weight.toLowerCase().includes(searchLower)) ||
        product.price.includes(searchTerm) ||
        (product.oldPrice && product.oldPrice.includes(searchTerm)) ||
        // Search by discount percentage
        (product.oldPrice &&
          Math.round(
            ((parseInt(product.oldPrice.replace("₹", "")) -
              parseInt(product.price.replace("₹", ""))) /
              parseInt(product.oldPrice.replace("₹", ""))) *
              100
          )
            .toString()
            .includes(searchTerm)) ||
        // Search by rating
        product.rating.toString().includes(searchTerm) ||
        product.reviews.toString().includes(searchTerm);

      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    switch (sortBy) {
      case "price-asc":
        filtered.sort(
          (a, b) =>
            parseInt(a.price.replace("₹", "")) -
            parseInt(b.price.replace("₹", ""))
        );
        break;
      case "price-desc":
        filtered.sort(
          (a, b) =>
            parseInt(b.price.replace("₹", "")) -
            parseInt(a.price.replace("₹", ""))
        );
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        // Sort by creation date if available, otherwise by id
        filtered.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          }
          return parseInt(b.id) - parseInt(a.id);
        });
        break;
      default:
        // Featured - keep original order
        break;
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy]);

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setSelectedImageIndex(0);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const nextImage = () => {
    if (selectedProduct?.images && selectedProduct.images.length > 0) {
      setSelectedImageIndex((prev) =>
        prev < selectedProduct.images!.length - 1 ? prev + 1 : 0
      );
    }
  };

  const prevImage = () => {
    if (selectedProduct?.images && selectedProduct.images.length > 0) {
      setSelectedImageIndex((prev) =>
        prev > 0 ? prev - 1 : selectedProduct.images!.length - 1
      );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div
        className="relative min-h-[70vh] flex items-center justify-center text-center"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='52' height='52' viewBox='0 0 52 52'%3E%3Cpath fill='%23ff0c07' fill-opacity='0.4' d='M0 17.83V0h17.83a3 3 0 0 1-5.66 2H5.9A5 5 0 0 1 2 5.9v6.27a3 3 0 0 1-2 5.66zm0 18.34a3 3 0 0 1 2 5.66v6.27A5 5 0 0 1 5.9 52h6.27a3 3 0 0 1 5.66 0H0V36.17zM36.17 52a3 3 0 0 1 5.66 0h6.27a5 5 0 0 1 3.9-3.9v-6.27a3 3 0 0 1 0-5.66V52H36.17zM0 31.93v-9.78a5 5 0 0 1 3.8.72l4.43-4.43a3 3 0 1 1 1.42 1.41L5.2 24.28a5 5 0 0 1 0 5.52l4.44 4.43a3 3 0 1 1-1.42 1.42L3.8 31.2a5 5 0 0 1-3.8.72zm52-14.1a3 3 0 0 1 0-5.66V5.9A5 5 0 0 1 48.1 2h-6.27a3 3 0 0 1-5.66-2H52v17.83zm0 14.1a4.97 4.97 0 0 1-1.72-.72l-4.43 4.44a3 3 0 1 1-1.41-1.42l4.43-4.43a5 5 0 0 1 0-5.52l-4.43-4.43a3 3 0 1 1 1.41-1.41l4.43 4.43c.53-.35 1.12-.6 1.72-.72v9.78zM22.15 0h9.78a5 5 0 0 1-.72 3.8l4.44 4.43a3 3 0 1 1-1.42 1.42L29.8 5.2a5 5 0 0 1-5.52 0l-4.43 4.44a3 3 0 1 1-1.41-1.42l4.43-4.43a3 3 0 0 1-.72-3.8zm0 52c.13-.6.37-1.19.72-1.72l-4.43-4.43a3 3 0 1 1 1.41-1.41l4.43 4.43a5 5 0 0 1 5.52 0l4.43-4.43a3 3 0 1 1 1.42 1.41l-4.44 4.43c.36.53.6 1.12.72 1.72h-9.78zm9.75-24a5 5 0 0 1-3.9 3.9v6.27a3 3 0 1 1-2 0V31.9a5 5 0 0 1-3.9-3.9h-6.27a3 3 0 1 1 0-2h6.27a5 5 0 0 1 3.9-3.9v-6.27a3 3 0 1 1 2 0v6.27a5 5 0 0 1 3.9 3.9h6.27a3 3 0 1 1 0 2H31.9z'%3E%3C/path%3E%3C/svg%3E")`,
        }}
      >
        {/* Overlay to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-700/80 via-red-700/70 to-pink-800/80" />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 bg-white bg-clip-text text-transparent drop-shadow-lg"
          >
            Premium Spices Collection
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-lg md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            Experience authentic flavors from around the world, handpicked and
            sourced directly from trusted farms.
          </motion.p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl p-6 mb-8 border border-red-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search for spices, oils, blends..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-white shadow-md text-orange-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode("compact")}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  viewMode === "compact"
                    ? "bg-white shadow-md text-orange-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Grid3X3 size={20} />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-red-500/80 to-pink-600/80 text-white rounded-2xl hover:from-red-600/80 hover:to-pink-700/80 transition-all duration-300 font-semibold"
            >
              <SlidersHorizontal size={20} />
              Filters
            </button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full transition-all duration-300 font-medium ${
                          selectedCategory === category
                            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setSearchTerm("Best Seller")}
            className="cursor-pointer px-4 py-2 bg-amber-100 text-amber-800 rounded-full hover:bg-amber-200 transition-all duration-300 font-medium"
          >
            🏆 Best Sellers
          </button>
          <button
            onClick={() => setSearchTerm("Hot Deal")}
            className="cursor-pointer px-4 py-2 bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-all duration-300 font-medium"
          >
            🔥 Hot Deals
          </button>
          <button
            onClick={() => setSearchTerm("New")}
            className="cursor-pointer px-4 py-2 bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-all duration-300 font-medium"
          >
            ✨ New Arrivals
          </button>
          <button
            onClick={() => setSearchTerm("Premium")}
            className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-all duration-300 font-medium"
          >
            👑 Premium
          </button>
          <button
            onClick={() => setSortBy("rating")}
            className="cursor-pointer px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200 transition-all duration-300 font-medium"
          >
            ⭐ Top Rated
          </button>
          <button
            onClick={() => setSortBy("price-asc")}
            className="cursor-pointer px-4 py-2 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-all duration-300 font-medium"
          >
            💰 Low Price
          </button>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
              setSortBy("featured");
            }}
            className="cursor-pointer px-4 py-2 bg-orange-100 text-orange-800 rounded-full hover:bg-orange-200 transition-all duration-300 font-medium"
          >
            🔄 Clear All
          </button>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 text-lg">
            Showing {filteredAndSortedProducts.length} of {products.length}{" "}
            products
          </p>
          <div className="text-sm text-gray-500">
            {selectedCategory !== "All" && (
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-medium">
                {selectedCategory}
              </span>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <motion.div
          layout
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {filteredAndSortedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
              onClick={() => openProductDetail(product)}
            >
              <div className="bg-white rounded-3xl overflow-hidden transition-all duration-500 border border-gray-100 h-full hover:shadow-2xl hover:border-orange-200">
                {/* Image Section */}
                <div className="relative overflow-hidden">
                  <div
                    className={`${
                      viewMode === "compact" ? "aspect-square" : "aspect-[4/3]"
                    } overflow-hidden`}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                  {/* Badge */}
                  {product.badge && (
                    <div
                      className={`absolute top-4 left-4 ${getBadgeColor(
                        product.badge
                      )} text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm`}
                    >
                      {product.badge}
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content Section */}
                <div className="p-6 bg-red-50/50">
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`${
                            i < Math.floor(product.rating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {product.rating}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                    {product.title}
                  </h3>

                  {/* Description */}
                  {viewMode === "grid" && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  )}

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price, Discount, and Weight on one line */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        {product.price}
                      </span>
                      {product.oldPrice && (
                        <>
                          <span className="text-sm text-gray-400 line-through font-medium">
                            {product.oldPrice}
                          </span>
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                            {Math.round(
                              ((parseInt(product.oldPrice.replace("₹", "")) -
                                parseInt(product.price.replace("₹", ""))) /
                                parseInt(product.oldPrice.replace("₹", ""))) *
                                100
                            )}
                            % OFF
                          </span>
                        </>
                      )}
                    </div>
                    {/* Weight is now a sibling of the price block */}
                    {product.weight && (
                      <span className="bg-red-100 text-red-700 text-sm font-bold px-3 py-1 rounded-full">
                        {product.weight}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <AddToCartButton
                      productId={product.id}
                      className="w-full"
                      size="md"
                      variant="primary"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredAndSortedProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSortBy("featured");
              }}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeProductDetail}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeProductDetail}
                className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300"
              >
                <X size={24} className="text-gray-600" />
              </button>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[90vh] scrollbar-hide">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                  {/* Image Gallery */}
                  <div className="space-y-4">
                    {/* Main Image */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                      <img
                        src={
                          selectedProduct.images?.[selectedImageIndex] ||
                          selectedProduct.image
                        }
                        alt={selectedProduct.title}
                        className="w-full h-full object-cover"
                      />

                      {/* Navigation Arrows */}
                      {selectedProduct.images &&
                        selectedProduct.images.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300"
                            >
                              <ChevronLeft
                                size={20}
                                className="text-gray-600"
                              />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300"
                            >
                              <ChevronRight
                                size={20}
                                className="text-gray-600"
                              />
                            </button>
                          </>
                        )}
                    </div>

                    {/* Thumbnail Images */}
                    {selectedProduct.images &&
                      selectedProduct.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-3">
                          {selectedProduct.images.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImageIndex(index)}
                              className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                selectedImageIndex === index
                                  ? "border-orange-500 shadow-lg"
                                  : "border-gray-200 hover:border-orange-300"
                              }`}
                            >
                              <img
                                src={image}
                                alt={`${selectedProduct.title} ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                  </div>

                  {/* Product Details */}
                  <div className="space-y-6">
                    {/* Badge */}
                    {selectedProduct.badge && (
                      <div
                        className={`inline-block ${getBadgeColor(
                          selectedProduct.badge
                        )} text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg`}
                      >
                        {selectedProduct.badge}
                      </div>
                    )}

                    {/* Title */}
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
                      {selectedProduct.title}
                    </h1>

                    {/* Weight and Tags */}
                    {selectedProduct.weight && (
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                        <span className="bg-red-100 text-red-700 text-sm font-bold px-3 py-1 rounded-full">
                          {selectedProduct.weight}
                        </span>
                        {selectedProduct.tags &&
                          selectedProduct.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {selectedProduct.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                      </div>
                    )}

                    {/* Rating */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            className={`${
                              i < Math.floor(selectedProduct.rating)
                                ? "text-amber-400 fill-amber-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-medium text-gray-700">
                        {selectedProduct.rating}
                      </span>
                      <span className="text-gray-500">
                        ({selectedProduct.reviews} reviews)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-4">
                      <span className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        {selectedProduct.price}
                      </span>
                      {selectedProduct.oldPrice && (
                        <>
                          <span className="text-xl text-gray-400 line-through">
                            {selectedProduct.oldPrice}
                          </span>
                          <div className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full">
                            {Math.round(
                              ((parseInt(
                                selectedProduct.oldPrice.replace("₹", "")
                              ) -
                                parseInt(
                                  selectedProduct.price.replace("₹", "")
                                )) /
                                parseInt(
                                  selectedProduct.oldPrice.replace("₹", "")
                                )) *
                                100
                            )}
                            % OFF
                          </div>
                        </>
                      )}
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Description
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedProduct.description}
                      </p>
                    </div>

                    {/* Category */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Category
                      </h3>
                      <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                        {selectedProduct.category}
                      </span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Quantity
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center bg-gray-100 rounded-xl">
                          <button
                            onClick={decrementQuantity}
                            className="p-3 hover:bg-gray-200 rounded-l-xl transition-colors duration-300"
                          >
                            <Minus size={20} className="text-gray-600" />
                          </button>
                          <span className="px-6 py-3 text-xl font-semibold text-gray-800 min-w-[60px] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={incrementQuantity}
                            className="p-3 hover:bg-gray-200 rounded-r-xl transition-colors duration-300"
                          >
                            <Plus size={20} className="text-gray-600" />
                          </button>
                        </div>
                        <span className="text-gray-600">
                          Total:{" "}
                          <span className="font-semibold text-2xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            ₹
                            {(
                              parseInt(selectedProduct.price.replace("₹", "")) *
                              quantity
                            ).toLocaleString()}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                      <button className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105">
                        <ShoppingCart size={24} />
                        Add {quantity} to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </div>
  );
}
