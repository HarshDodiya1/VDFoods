'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { productAPI, Product, CreateProductData, UpdateProductData } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { 
  Plus, 
  X, 
  Upload, 
  Package, 
  IndianRupee, 
  Tag, 
  Weight,
  Image as ImageIcon,
  Loader2,
  Star,
  MessageCircle,
  Award,
  CloudUpload
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

const productSchema = z.object({
  title: z.string().min(1, 'Product title is required').max(255, 'Title is too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description is too long'),
  price: z.string().min(1, 'Price is required'),
  oldPrice: z.string().optional(),
  image: z.string().min(1, 'Main image is required'),
  images: z.array(z.string().url('Invalid image URL')).optional(),
  category: z.string().min(1, 'Category is required'),
  badge: z.string().optional(),
  rating: z.number().min(0, 'Rating cannot be negative').max(5, 'Rating cannot exceed 5').optional(),
  reviews: z.number().min(0, 'Reviews count cannot be negative').optional(),
  weight: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: () => void;
}

const categories = ["Spices", "Grains", "Pulses", "Flours", "Herbs", "Powders"];
const badges = ["Best Seller", "New", "Sale", "Premium", "Limited", "Popular"];

export default function ProductFormNew({ product, onSubmit }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [mainImage, setMainImage] = useState<string>(product?.image || '');
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingAdditional, setIsUploadingAdditional] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product?.title || '',
      description: product?.description || '',
      price: product?.price || '',
      oldPrice: product?.oldPrice || '',
      image: product?.image || '',
      images: product?.images || [],
      category: product?.category || '',
      badge: product?.badge || '',
      rating: product?.rating || 0,
      reviews: product?.reviews || 0,
      weight: product?.weight || '',
      tags: product?.tags || [],
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        title: product.title,
        description: product.description,
        price: product.price,
        oldPrice: product.oldPrice || '',
        image: product.image,
        images: product.images,
        category: product.category,
        badge: product.badge || '',
        rating: product.rating,
        reviews: product.reviews,
        weight: product.weight || '',
        tags: product.tags,
      });
      setTags(product.tags);
      setImages(product.images);
      setMainImage(product.image);
    }
  }, [product, form]);

  const uploadToCloudinary = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    const uploadPreset = "my_unsigned_preset"; // Make sure to set your correct preset

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dgg2tlvnk/image/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        uploadedUrls.push(response.data.secure_url);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image");
      }
    }

    return uploadedUrls;
  };

  const onMainImageDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      
      setIsUploadingMain(true);
      try {
        const uploadedUrls = await uploadToCloudinary(acceptedFiles);
        if (uploadedUrls.length > 0) {
          const url = uploadedUrls[0];
          setMainImage(url);
          form.setValue('image', url);
          toast.success('Main image uploaded successfully');
        }
      } catch (error) {
        toast.error('Failed to upload main image');
      } finally {
        setIsUploadingMain(false);
      }
    },
    [form]
  );

  const onAdditionalImagesDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      
      setIsUploadingAdditional(true);
      try {
        const uploadedUrls = await uploadToCloudinary(acceptedFiles);
        if (uploadedUrls.length > 0) {
          const updatedImages = [...images, ...uploadedUrls];
          setImages(updatedImages);
          form.setValue('images', updatedImages);
          toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
        }
      } catch (error) {
        toast.error('Failed to upload additional images');
      } finally {
        setIsUploadingAdditional(false);
      }
    },
    [images, form]
  );

  const { getRootProps: getMainImageRootProps, getInputProps: getMainImageInputProps, isDragActive: isMainImageDragActive } = useDropzone({
    onDrop: onMainImageDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] },
    multiple: false,
  });

  const { getRootProps: getAdditionalImagesRootProps, getInputProps: getAdditionalImagesInputProps, isDragActive: isAdditionalImagesDragActive } = useDropzone({
    onDrop: onAdditionalImagesDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] },
    multiple: true,
  });

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setIsLoading(true);
      
      const formData: CreateProductData | UpdateProductData = {
        ...data,
        images,
        tags,
        rating: data.rating || 0,
        reviews: data.reviews || 0,
      };

      if (product) {
        await productAPI.updateProduct(product._id, formData);
        toast.success('Product updated successfully!');
      } else {
        await productAPI.createProduct(formData as CreateProductData);
        toast.success('Product created successfully!');
      }

      onSubmit();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      form.setValue('tags', updatedTags);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    form.setValue('tags', updatedTags);
  };

  const removeImage = (imageToRemove: string) => {
    const updatedImages = images.filter(img => img !== imageToRemove);
    setImages(updatedImages);
    form.setValue('images', updatedImages);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          {product ? 'Edit Product' : 'Create New Product'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter product description" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      Current Price
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="₹299" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="oldPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Old Price (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="₹399" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Weight className="w-4 h-4" />
                      Weight
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="500g, 1kg, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Badge, Rating, Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="badge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      Badge (Optional)
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select badge" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {badges.map((badge) => (
                          <SelectItem key={badge} value={badge}>
                            {badge}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Rating (0-5)
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="5" 
                        step="0.1"
                        placeholder="4.5"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reviews"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      Reviews Count
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="124"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Main Image Upload */}
            <div>
              <FormLabel className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-4 h-4" />
                Main Product Image
              </FormLabel>
              
              <div
                {...getMainImageRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isMainImageDragActive 
                    ? 'border-primary bg-primary/10' 
                    : 'border-gray-300 hover:border-primary'
                }`}
              >
                <input {...getMainImageInputProps()} />
                {isUploadingMain ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="ml-2">Uploading...</span>
                  </div>
                ) : mainImage ? (
                  <div className="space-y-4">
                    <div className="relative w-32 h-32 mx-auto">
                      <Image
                        src={mainImage}
                        alt="Main product image"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      Drop a new image here or click to replace
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <CloudUpload className="w-12 h-12 mx-auto text-gray-400" />
                    <p className="text-lg font-medium">
                      {isMainImageDragActive ? 'Drop the image here' : 'Upload main product image'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Drag and drop or click to select (JPG, PNG, GIF, WebP)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Images Upload */}
            <div>
              <FormLabel className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-4 h-4" />
                Additional Images (Optional)
              </FormLabel>
              
              <div
                {...getAdditionalImagesRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isAdditionalImagesDragActive 
                    ? 'border-primary bg-primary/10' 
                    : 'border-gray-300 hover:border-primary'
                }`}
              >
                <input {...getAdditionalImagesInputProps()} />
                {isUploadingAdditional ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="ml-2">Uploading...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <CloudUpload className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="font-medium">
                      {isAdditionalImagesDragActive ? 'Drop images here' : 'Upload additional images'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Drag and drop or click to select multiple images
                    </p>
                  </div>
                )}
              </div>

              {/* Display additional images */}
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="relative w-full aspect-square">
                        <Image
                          src={image}
                          alt={`Additional image ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(image)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Tags */}
            <div>
              <FormLabel className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4" />
                Tags
              </FormLabel>
              
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Enter tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onSubmit}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {product ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  product ? 'Update Product' : 'Create Product'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
