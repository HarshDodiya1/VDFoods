const express = require('express');
const router = express.Router();
const productRoutes = require('../controllers/productController.js');

router.get('/products', productRoutes.getAllProducts);
router.get('/products/:id', productRoutes.getProductById);

// Admin Routes
router.post('/products', productRoutes.createProduct);
router.put('/products/:id', productRoutes.updateProduct);
router.delete('/products/:id', productRoutes.deleteProduct);

module.exports = router;
