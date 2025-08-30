const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js');

// Authentication routes
router.post('/login', adminController.login);
router.get("/me", adminController.me);
router.post("/logout", adminController.logout);
router.post("/change-password", adminController.changePassword);

// Dashboard and management routes
// router.get('/dashboard', adminController.dashboard);
// router.get('/orders', adminController.getOrders);
// router.put('/order/:id', adminController.updateOrder);

module.exports = router;
