const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController.js");

// Authentication routes
router.post("/login", adminController.login);
router.get("/me", adminController.me);
router.post("/logout", adminController.logout);
router.post("/change-password", adminController.changePassword);

module.exports = router;
