const express = require("express");
const router = express.Router();
const {
  submitContactForm,
  getAllContacts,
} = require("../controllers/contactUsController.js");
const { authenticateAdmin } = require("../middlewares/adminMiddleware.js");

// @route   POST /api/contact
// @desc    Submit a contact form
router.post("/", submitContactForm);

// (Optional) Admin route to view all contact submissions
// @route   GET /api/contact
// @desc    Get all contact form entries
router.use(authenticateAdmin); // Middleware to protect admin routes
router.get("/", getAllContacts);

module.exports = router;
