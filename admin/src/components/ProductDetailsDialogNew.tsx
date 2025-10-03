"use client";

import { Product } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Package,
  IndianRupee,
  Tag,
  Weight,
  Calendar,
  ImageIcon,
  FileText,
  Info,
  Star,
  MessageCircle,
  Award,
  Clock,
} from "lucide-react";
import Image from "next/image";

interface ProductDetailsDialogProps {
  product: Product;
}

export default function ProductDetailsDialogNew({
  product,
}: ProductDetailsDialogProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBadgeVariant = (badge?: string) => {
    if (!badge) return "secondary";
    switch (badge.toLowerCase()) {
      case "best seller":
        return "default";
      case "new":
        return "secondary";
      case "sale":
        return "destructive";
      case "premium":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">{product.title}</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            {product.category}
          </Badge>
          {product.badge && (
            <Badge variant={getBadgeVariant(product.badge)}>
              {product.badge}
            </Badge>
          )}
          <div className="flex items-center text-sm text-amber-600">
            <Star className="w-4 h-4 fill-current mr-1" />
            <span>{product.rating}</span>
            <span className="text-gray-500 ml-1">
              ({product.reviews} reviews)
            </span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Basic Information */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="h-5 w-5 text-blue-600" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Product ID
              </label>
              <p className="text-sm text-gray-900 font-mono bg-white p-2 rounded border">
                {product._id}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Slug</label>
              <p className="text-sm text-gray-900 font-mono bg-white p-2 rounded border">
                {product.slug}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Description
            </label>
            <p className="text-sm text-gray-900 bg-white p-3 rounded border mt-1">
              {product.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Information */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <IndianRupee className="h-5 w-5 text-green-600" />
            Pricing Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Current Price
              </label>
              <p className="text-2xl font-bold text-green-600 bg-white p-3 rounded border">
                {product.price}
              </p>
            </div>
            {product.oldPrice && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Old Price
                </label>
                <p className="text-xl text-gray-500 line-through bg-white p-3 rounded border">
                  {product.oldPrice}
                </p>
              </div>
            )}
            {product.weight && (
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Weight className="h-4 w-4" />
                  Weight
                </label>
                <p className="text-lg font-medium bg-white p-3 rounded border">
                  {product.weight}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ratings & Reviews */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-amber-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Star className="h-5 w-5 text-amber-600" />
            Customer Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Average Rating
              </label>
              <div className="flex items-center gap-2 bg-white p-3 rounded border">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= product.rating
                          ? "text-amber-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xl font-bold">{product.rating}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                Total Reviews
              </label>
              <p className="text-xl font-bold bg-white p-3 rounded border">
                {product.reviews} reviews
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ImageIcon className="h-5 w-5 text-purple-600" />
            Product Images
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Image */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Main Image
            </label>
            <div className="mt-2 relative w-48 h-48 bg-white border rounded-lg overflow-hidden">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Additional Images */}
          {product.images.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700">
                Additional Images ({product.images.length})
              </label>
              <div className="mt-2 grid grid-cols-3 md:grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 bg-white border rounded-lg overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt={`${product.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tags */}
      {product.tags.length > 0 && (
        <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-slate-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Tag className="h-5 w-5 text-gray-600" />
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timestamps */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-slate-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-gray-600" />
            Timestamps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Created At
              </label>
              <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                {formatDate(product.createdAt)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Last Updated
              </label>
              <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                {formatDate(product.updatedAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
