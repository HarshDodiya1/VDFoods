"use client";

import { useState, useEffect, useMemo } from "react";
import { productAPI, Product } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  ShoppingCart,
  IndianRupee,
  Tag,
  Calendar,
  ImageIcon,
  MoreHorizontal,
  RefreshCw,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  Star,
  MessageCircle,
  Award,
} from "lucide-react";
import ProductFormNew from "@/components/ProductFormNew";
import ProductDetailsDialogNew from "@/components/ProductDetailsDialogNew";
import LoadingSpinner from "@/components/LoadingSpinner";
import AdminNavbar from "@/components/AdminNavbar";
import { toast } from "sonner";
import Image from "next/image";

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [badgeFilter, setBadgeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const pageSize = 12;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAllProducts();
      setAllProducts(response.data.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Client-side filtering and sorting
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search) ||
          product.category.toLowerCase().includes(search) ||
          product.tags.some((tag) => tag.toLowerCase().includes(search))
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter
      );
    }

    // Badge filter
    if (badgeFilter !== "all") {
      if (badgeFilter === "no-badge") {
        filtered = filtered.filter((product) => !product.badge);
      } else {
        filtered = filtered.filter((product) => product.badge === badgeFilter);
      }
    }

    // Sorting
    filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case "title":
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case "price":
          // Extract numeric value from price string
          aVal = parseFloat(a.price.replace(/[^\d.]/g, "")) || 0;
          bVal = parseFloat(b.price.replace(/[^\d.]/g, "")) || 0;
          break;
        case "rating":
          aVal = a.rating;
          bVal = b.rating;
          break;
        case "createdAt":
        default:
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [allProducts, searchTerm, categoryFilter, badgeFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / pageSize);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, badgeFilter]);

  const handleDeleteProduct = async (product: Product) => {
    try {
      await productAPI.deleteProduct(product._id);
      toast.success(`Product "${product.title}" deleted successfully`);
      fetchProducts();
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleProductSubmit = () => {
    fetchProducts();
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedProduct(null);
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

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Get unique categories and badges for filters
  const categories = useMemo(() => {
    return Array.from(new Set(allProducts.map((p) => p.category))).sort();
  }, [allProducts]);

  const badges = useMemo(() => {
    return Array.from(
      new Set(allProducts.filter((p) => p.badge).map((p) => p.badge!))
    ).sort();
  }, [allProducts]);

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {paginatedProducts.map((product) => (
        <Card
          key={product._id}
          className="group hover:shadow-lg transition-shadow duration-200"
        >
          <div className="relative">
            {product.image && (
              <div className="relative h-48 w-full">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
            )}
            {product.badge && (
              <Badge
                variant={getBadgeVariant(product.badge)}
                className="absolute top-2 left-2"
              >
                {product.badge}
              </Badge>
            )}
          </div>

          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg line-clamp-1">
                {product.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center gap-2">
                <Badge variant="outline">{product.category}</Badge>
                <div className="flex items-center text-sm text-amber-600">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1">{product.rating}</span>
                  <span className="text-gray-500 ml-1">
                    ({product.reviews})
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-600">
                    {product.price}
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {product.oldPrice}
                    </span>
                  )}
                </div>
                {product.weight && (
                  <Badge variant="secondary" className="text-xs">
                    {product.weight}
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {product.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {product.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{product.tags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>

          <div className="p-4 pt-0 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                setSelectedProduct(product);
                setIsDetailsDialogOpen(true);
              }}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                setSelectedProduct(product);
                setIsEditDialogOpen(true);
              }}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setSelectedProduct(product);
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderTableView = () => (
    <Card>
      <ScrollArea className="h-[600px]">
        <div className="min-w-[1200px]">
          {" "}
          {/* Force minimum width for horizontal scroll */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Product</TableHead>
                <TableHead className="w-[120px]">Category</TableHead>
                <TableHead className="w-[100px]">Price</TableHead>
                <TableHead className="w-[100px]">Rating</TableHead>
                <TableHead className="w-[100px]">Badge</TableHead>
                <TableHead className="w-[80px]">Weight</TableHead>
                <TableHead className="w-[120px]">Created</TableHead>
                <TableHead className="w-[150px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product._id} className="hover:bg-gray-50">
                  <TableCell className="w-[300px]">
                    <div className="flex items-center gap-3">
                      {product.image && (
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm truncate">
                          {product.title}
                        </div>
                        <div className="text-xs text-gray-600">
                          {truncateText(product.description, 60)}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.tags.slice(0, 2).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs py-0 px-1"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {product.tags.length > 2 && (
                            <Badge
                              variant="outline"
                              className="text-xs py-0 px-1"
                            >
                              +{product.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="w-[120px]">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-[100px]">
                    <div>
                      <div className="font-semibold text-green-600 text-sm">
                        {product.price}
                      </div>
                      {product.oldPrice && (
                        <div className="text-xs text-gray-500 line-through">
                          {product.oldPrice}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="w-[100px]">
                    <div className="flex items-center text-xs">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" />
                      <span>{product.rating}</span>
                      <span className="text-gray-500 ml-1">
                        ({product.reviews})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="w-[100px]">
                    {product.badge && (
                      <Badge
                        variant={getBadgeVariant(product.badge)}
                        className="text-xs"
                      >
                        {product.badge}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="w-[80px]">
                    {product.weight && (
                      <Badge variant="secondary" className="text-xs">
                        {product.weight}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="w-[120px]">
                    <div className="text-xs">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="w-[150px] text-right">
                    <div className="flex justify-end gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsDetailsDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Details</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Product</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete Product</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <LoadingSpinner />
      </div>
    );
  }

  const stats = [
    {
      title: "Total Products",
      value: allProducts.length,
      icon: Package,
      change: "+12%",
      changeType: "increase" as const,
    },
    {
      title: "Categories",
      value: categories.length,
      icon: Tag,
      change: "+2%",
      changeType: "increase" as const,
    },
    {
      title: "Avg. Rating",
      value:
        allProducts.length > 0
          ? (
              allProducts.reduce((sum, p) => sum + p.rating, 0) /
              allProducts.length
            ).toFixed(1)
          : "0.0",
      icon: Star,
      change: "+0.3",
      changeType: "increase" as const,
    },
    {
      title: "Total Reviews",
      value: allProducts.reduce((sum, p) => sum + p.reviews, 0),
      icon: MessageCircle,
      change: "+124",
      changeType: "increase" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Products Management
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your product catalog, pricing, and inventory. Showing{" "}
                {filteredAndSortedProducts.length} of {allProducts.length}{" "}
                products.
              </p>
            </div>

            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Product</DialogTitle>
                </DialogHeader>
                <ProductFormNew onSubmit={handleProductSubmit} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-full">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span
                    className={`font-medium ${
                      stat.changeType === "increase"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-gray-600 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Controls with Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search and View Toggle Row */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search products by name, description, category, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "table" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Filters and Sort Row */}
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={badgeFilter} onValueChange={setBadgeFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by Badge" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Badges</SelectItem>
                      <SelectItem value="no-badge">No Badge</SelectItem>
                      {badges.map((badge) => (
                        <SelectItem key={badge} value={badge}>
                          {badge}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">Date Created</SelectItem>
                      <SelectItem value="title">Name</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                  >
                    {sortOrder === "asc" ? (
                      <SortAsc className="w-4 h-4" />
                    ) : (
                      <SortDesc className="w-4 h-4" />
                    )}
                  </Button>

                  <Button variant="outline" size="sm" onClick={fetchProducts}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>

                {/* Clear Filters */}
                {(searchTerm ||
                  categoryFilter !== "all" ||
                  badgeFilter !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setCategoryFilter("all");
                      setBadgeFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Display */}
        {filteredAndSortedProducts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {allProducts.length === 0
                  ? "No products found"
                  : "No products match your filters"}
              </h3>
              <p className="text-gray-600 mb-4">
                {allProducts.length === 0
                  ? "Get started by creating your first product."
                  : "Try adjusting your search terms or filters."}
              </p>
              {allProducts.length === 0 && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {viewMode === "table" ? renderTableView() : renderGridView()}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page =
                      Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                      i;
                    if (page <= totalPages) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      );
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            {selectedProduct && (
              <ProductFormNew
                product={selectedProduct}
                onSubmit={handleProductSubmit}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Product Details Dialog with Proper Scrolling */}
        <Dialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
        >
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Product Details</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(90vh-120px)] pr-6">
              {selectedProduct && (
                <ProductDetailsDialogNew product={selectedProduct} />
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-600">
                Are you sure you want to delete "{selectedProduct?.title}"? This
                action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  selectedProduct && handleDeleteProduct(selectedProduct)
                }
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
