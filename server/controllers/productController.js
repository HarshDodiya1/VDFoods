// productController.js

const Product = require('../models/productModel.js');
const mongoose = require('mongoose');

// Helper function to generate slug from name
const generateSlug = (name) => {
  return name
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

// Controller to get all products with pagination and filtering
const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      tags,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};

    // Category filter
    if (category && isValidObjectId(category)) {
      filter.category = category;
    }

    // Tags filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',');
      filter.tags = { $in: tagArray };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice && !isNaN(minPrice)) {
        filter.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice && !isNaN(maxPrice)) {
        filter.price.$lte = parseFloat(maxPrice);
      }
    }

    // Search filter (name and description)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = Math.max(1, Math.min(100, parseInt(limit))); // Max 100 items per page
    const skip = (pageNumber - 1) * limitNumber;

    // Sort options
    const sortOptions = {};
    const validSortFields = ['name', 'price', 'createdAt', 'updatedAt'];
    if (validSortFields.includes(sortBy)) {
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions.createdAt = -1; // Default sort
    }

    // Execute query
    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber)
      .lean();

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);
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

    // 2. Find the product
    const product = await Product.findById(id).populate('category', 'name description');

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

// Controller to get a single product by slug
// const getProductBySlug = async (req, res) => {
//   try {
//     const { slug } = req.params;

//     // 1. Validate slug
//     if (!slug) {
//       return res.status(400).json({ message: 'Product slug is required.' });
//     }

//     // 2. Find the product by slug
//     const product = await Product.findOne({ slug }).populate('category', 'name description');

//     if (!product) {
//       return res.status(404).json({ message: 'Product not found.' });
//     }

//     res.status(200).json({
//       message: 'Product retrieved successfully',
//       data: product
//     });

//   } catch (error) {
//     console.error('Get product by slug error:', error);
//     res.status(500).json({ message: 'Server error while retrieving product' });
//   }
// };

// Controller to create a new product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      originalPrice,
      discount,
      images,
      category,
      tags,
      weight
    } = req.body;

    // 1. Basic input validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        message: 'Name, description, price, and category are required fields.'
      });
    }

    // 2. Validate price
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number.' });
    }

    // 3. Validate original price if provided
    if (originalPrice !== undefined && (isNaN(originalPrice) || originalPrice < 0)) {
      return res.status(400).json({ message: 'Original price must be a non-negative number.' });
    }

    // 4. Validate discount
    if (discount !== undefined && (isNaN(discount) || discount < 0 || discount > 100)) {
      return res.status(400).json({ message: 'Discount must be between 0 and 100.' });
    }

    // 5. Validate category ID
    if (!isValidObjectId(category)) {
      return res.status(400).json({ message: 'Invalid category ID format.' });
    }

    // 6. Validate images array
    if (images && !Array.isArray(images)) {
      return res.status(400).json({ message: 'Images must be an array.' });
    }

    // 7. Validate tags array
    if (tags && !Array.isArray(tags)) {
      return res.status(400).json({ message: 'Tags must be an array.' });
    }

    // 8. Generate unique slug
    let slug = generateSlug(name);
    
    // Check if slug already exists and make it unique
    let slugExists = await Product.findOne({ slug });
    let counter = 1;
    const originalSlug = slug;
    
    while (slugExists) {
      slug = `${originalSlug}-${counter}`;
      slugExists = await Product.findOne({ slug });
      counter++;
    }

    // 9. Create new product
    const newProduct = new Product({
      name: name.trim(),
      slug,
      description: description.trim(),
      shortDescription: shortDescription?.trim(),
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      discount: discount ? parseFloat(discount) : 0,
      images: images || [],
      category,
      tags: tags || [],
      weight: weight?.trim()
    });

    // 10. Save the product
    const savedProduct = await newProduct.save();

    // 11. Populate category for response
    await savedProduct.populate('category', 'name description');

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
      name,
      description,
      shortDescription,
      price,
      originalPrice,
      discount,
      images,
      category,
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

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ message: 'Product name cannot be empty.' });
      }
      updateData.name = name.trim();
      
      // Generate new slug if name changed
      if (name.trim() !== existingProduct.name) {
        let newSlug = generateSlug(name);
        
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

    if (shortDescription !== undefined) {
      updateData.shortDescription = shortDescription?.trim();
    }

    if (price !== undefined) {
      if (isNaN(price) || price <= 0) {
        return res.status(400).json({ message: 'Price must be a positive number.' });
      }
      updateData.price = parseFloat(price);
    }

    if (originalPrice !== undefined) {
      if (originalPrice !== null && (isNaN(originalPrice) || originalPrice < 0)) {
        return res.status(400).json({ message: 'Original price must be a non-negative number.' });
      }
      updateData.originalPrice = originalPrice ? parseFloat(originalPrice) : undefined;
    }

    if (discount !== undefined) {
      if (isNaN(discount) || discount < 0 || discount > 100) {
        return res.status(400).json({ message: 'Discount must be between 0 and 100.' });
      }
      updateData.discount = parseFloat(discount);
    }

    if (images !== undefined) {
      if (!Array.isArray(images)) {
        return res.status(400).json({ message: 'Images must be an array.' });
      }
      updateData.images = images;
    }

    if (category !== undefined) {
      if (!isValidObjectId(category)) {
        return res.status(400).json({ message: 'Invalid category ID format.' });
      }
      updateData.category = category;
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
    ).populate('category', 'name description');

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
        name: deletedProduct.name
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
    const { categoryId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // 1. Validate category ID
    if (!categoryId) {
      return res.status(400).json({ message: 'Category ID is required.' });
    }

    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({ message: 'Invalid category ID format.' });
    }

    // 2. Pagination
    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = Math.max(1, Math.min(100, parseInt(limit)));
    const skip = (pageNumber - 1) * limitNumber;

    // 3. Sort options
    const sortOptions = {};
    const validSortFields = ['name', 'price', 'createdAt', 'updatedAt'];
    if (validSortFields.includes(sortBy)) {
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions.createdAt = -1;
    }

    // 4. Get products
    const products = await Product.find({ category: categoryId })
      .populate('category', 'name')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber)
      .lean();

    // 5. Get total count
    const totalProducts = await Product.countDocuments({ category: categoryId });
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
//   getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
};
