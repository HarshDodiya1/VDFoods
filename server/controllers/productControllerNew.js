// productController.js

const Product = require('../models/productModel.js');
const mongoose = require('mongoose');

// Helper function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Controller to get all products - simplified version
const getAllProducts = async (req, res) => {
  try {
    // Get all products without any filtering or pagination
    const products = await Product.find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean();

    res.status(200).json({
      message: 'Products retrieved successfully',
      data: {
        products,
        total: products.length,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalProducts: products.length,
          hasNextPage: false,
          hasPrevPage: false
        }
      }
    });

  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({ message: 'Server error while retrieving products' });
  }
};

// Controller to get a single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate product ID
    if (!id) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid product ID format.' });
    }

    // 2. Find the product (no populate needed since category is now a string)
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json({
      message: 'Product retrieved successfully',
      data: product
    });

  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ message: 'Server error while retrieving product' });
  }
};

// Controller to create a new product
const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      oldPrice,
      image,
      images,
      category,
      badge,
      rating,
      reviews,
      tags,
      weight
    } = req.body;

    // 1. Basic input validation
    if (!title || !description || !price || !category || !image) {
      return res.status(400).json({
        message: 'Title, description, price, category, and main image are required fields.'
      });
    }

    // 2. Validate category (must be one of the allowed enum values)
    const allowedCategories = ["Spices", "Grains", "Pulses", "Flours", "Herbs", "Powders"];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ 
        message: `Category must be one of: ${allowedCategories.join(', ')}` 
      });
    }

    // 3. Validate rating if provided
    if (rating !== undefined && (isNaN(rating) || rating < 0 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 0 and 5.' });
    }

    // 4. Validate reviews count if provided
    if (reviews !== undefined && (isNaN(reviews) || reviews < 0)) {
      return res.status(400).json({ message: 'Reviews count must be non-negative.' });
    }

    // 5. Validate images array
    if (images && !Array.isArray(images)) {
      return res.status(400).json({ message: 'Additional images must be an array.' });
    }

    // 6. Validate tags array
    if (tags && !Array.isArray(tags)) {
      return res.status(400).json({ message: 'Tags must be an array.' });
    }

    // 7. Generate unique slug from title
    let slug = generateSlug(title);
    
    // Check if slug already exists and make it unique
    let slugExists = await Product.findOne({ slug });
    let counter = 1;
    const originalSlug = slug;
    
    while (slugExists) {
      slug = `${originalSlug}-${counter}`;
      slugExists = await Product.findOne({ slug });
      counter++;
    }

    // 8. Create new product with the updated schema
    const newProduct = new Product({
      title: title.trim(),
      slug,
      description: description.trim(),
      price: price.toString(), // Store as string to support "₹299" format
      oldPrice: oldPrice ? oldPrice.toString() : undefined,
      image: image.trim(),
      images: images || [],
      category,
      badge: badge?.trim(),
      rating: rating ? parseFloat(rating) : 0,
      reviews: reviews ? parseInt(reviews) : 0,
      tags: tags || [],
      weight: weight?.trim()
    });

    // 9. Save the product
    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: 'Product created successfully',
      data: savedProduct
    });

  } catch (error) {
    console.error('Create product error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Product with this slug already exists.' });
    }
    
    res.status(500).json({ message: 'Server error while creating product' });
  }
};

// Controller to update a product by ID
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      oldPrice,
      image,
      images,
      category,
      badge,
      rating,
      reviews,
      tags,
      weight
    } = req.body;

    // 1. Validate product ID
    if (!id) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid product ID format.' });
    }

    // 2. Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // 3. Build update object with validation
    const updateData = {};

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ message: 'Product title cannot be empty.' });
      }
      updateData.title = title.trim();
      
      // Generate new slug if title changed
      if (title.trim() !== existingProduct.title) {
        let newSlug = generateSlug(title);
        
        // Check if new slug already exists (excluding current product)
        let slugExists = await Product.findOne({ slug: newSlug, _id: { $ne: id } });
        let counter = 1;
        const originalSlug = newSlug;
        
        while (slugExists) {
          newSlug = `${originalSlug}-${counter}`;
          slugExists = await Product.findOne({ slug: newSlug, _id: { $ne: id } });
          counter++;
        }
        
        updateData.slug = newSlug;
      }
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({ message: 'Product description cannot be empty.' });
      }
      updateData.description = description.trim();
    }

    if (price !== undefined) {
      updateData.price = price.toString();
    }

    if (oldPrice !== undefined) {
      updateData.oldPrice = oldPrice ? oldPrice.toString() : undefined;
    }

    if (image !== undefined) {
      updateData.image = image.trim();
    }

    if (images !== undefined) {
      if (!Array.isArray(images)) {
        return res.status(400).json({ message: 'Additional images must be an array.' });
      }
      updateData.images = images;
    }

    if (category !== undefined) {
      const allowedCategories = ["Spices", "Grains", "Pulses", "Flours", "Herbs", "Powders"];
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({ 
          message: `Category must be one of: ${allowedCategories.join(', ')}` 
        });
      }
      updateData.category = category;
    }

    if (badge !== undefined) {
      updateData.badge = badge?.trim();
    }

    if (rating !== undefined) {
      if (isNaN(rating) || rating < 0 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 0 and 5.' });
      }
      updateData.rating = parseFloat(rating);
    }

    if (reviews !== undefined) {
      if (isNaN(reviews) || reviews < 0) {
        return res.status(400).json({ message: 'Reviews count must be non-negative.' });
      }
      updateData.reviews = parseInt(reviews);
    }

    if (tags !== undefined) {
      if (!Array.isArray(tags)) {
        return res.status(400).json({ message: 'Tags must be an array.' });
      }
      updateData.tags = tags;
    }

    if (weight !== undefined) {
      updateData.weight = weight?.trim();
    }

    // 4. Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Product updated successfully',
      data: updatedProduct
    });

  } catch (error) {
    console.error('Update product error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Product with this slug already exists.' });
    }
    
    res.status(500).json({ message: 'Server error while updating product' });
  }
};

// Controller to delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate product ID
    if (!id) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid product ID format.' });
    }

    // 2. Find and delete the product
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json({
      message: 'Product deleted successfully',
      data: {
        id: deletedProduct._id,
        title: deletedProduct.title
      }
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
};

// Controller to get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params; // Changed from categoryId to categoryName
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // 1. Validate category name
    if (!categoryName) {
      return res.status(400).json({ message: 'Category name is required.' });
    }

    const allowedCategories = ["Spices", "Grains", "Pulses", "Flours", "Herbs", "Powders"];
    if (!allowedCategories.includes(categoryName)) {
      return res.status(400).json({ 
        message: `Category must be one of: ${allowedCategories.join(', ')}` 
      });
    }

    // 2. Pagination
    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = Math.max(1, Math.min(100, parseInt(limit)));
    const skip = (pageNumber - 1) * limitNumber;

    // 3. Sort options
    const sortOptions = {};
    const validSortFields = ['title', 'price', 'createdAt', 'updatedAt', 'rating'];
    if (validSortFields.includes(sortBy)) {
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions.createdAt = -1;
    }

    // 4. Get products
    const products = await Product.find({ category: categoryName })
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber)
      .lean();

    // 5. Get total count
    const totalProducts = await Product.countDocuments({ category: categoryName });
    const totalPages = Math.ceil(totalProducts / limitNumber);

    res.status(200).json({
      message: 'Products retrieved successfully',
      data: {
        products,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalProducts,
          hasNextPage: pageNumber < totalPages,
          hasPrevPage: pageNumber > 1
        }
      }
    });

  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({ message: 'Server error while retrieving products' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
};
