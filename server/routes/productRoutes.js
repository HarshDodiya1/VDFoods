const express = require('express');
const router = express.Router();
const productRoutes = require('../controllers/productController.js');

router.get('/', productRoutes.getAllProducts);
router.get('/:id', productRoutes.getProductById);

// Admin Routes
router.post('/', productRoutes.createProduct);
router.put('/:id', productRoutes.updateProduct);
router.delete('/:id', productRoutes.deleteProduct);

module.exports = router;
