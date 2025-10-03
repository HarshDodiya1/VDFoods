"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe, Star } from "lucide-react";
import AddToCartButton from "./AddToCartButton";
import apiService, { Product as ApiProduct } from "../utils/api";
import WrapButton from "./ui/wrap-button";

interface Product extends Omit<ApiProduct, "_id"> {
  id: string;
}

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

export default function ProductShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getAllProducts();

        // Transform backend data to frontend format and limit to 6 products
        const transformedProducts: Product[] = response.data.products
          .slice(0, 3)
          .map((product) => ({
            ...product,
            id: product._id,
            oldPrice: product.oldPrice || "",
            badge: product.badge || "",
            images: product.images || [product.image],
          }));

        setProducts(transformedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="relative w-full max-w-7xl mx-auto px-6 mt-12 min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 mt-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
          Premium Spice Collection
        </h2>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Discover our handpicked selection of authentic spices and oils,
          sourced directly from farms across India
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
          >
            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              {/* Image Section */}
              <div className="relative overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Badge */}
                {product.badge && (
                  <div
                    className={`absolute top-4 left-4 ${getBadgeColor(
                      product.badge
                    )} text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg`}
                  >
                    {product.badge}
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6">
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
                <p className="text-sm text-gray-600 mb-2 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                {/* Tags below description */}
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

                {/* Price and Weight in one line */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      {product.price}
                    </span>
                    {product.oldPrice && (
                      <>
                        <span className="text-sm text-gray-400 line-through font-medium">
                          {product.oldPrice}
                        </span>
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
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
                  {product.weight && (
                    <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
                      {product.weight}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <AddToCartButton
                  productId={product.id}
                  className=" w-full "
                  size="md"
                  variant="primary"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <WrapButton className="mt-5" href="/products">
          <Globe className="animate-spin " />
          View All Products
        </WrapButton>
      </div>
    </div>
  );
}
