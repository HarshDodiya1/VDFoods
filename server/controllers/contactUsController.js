const Contact = require('../models/contactUsModel');

// @desc    Handle contact form submission
// @route   POST /api/contact
exports.submitContactForm = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, inquiryType, message } = req.body;

    // Basic validation
    if (!fullName || !email || !inquiryType || !message) {
      return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    const newContact = new Contact({
      fullName,
      email,
      phoneNumber,
      inquiryType,
      message
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! We will get back to you soon.',
      data: newContact
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.'
    });
  }
};

// @desc    (Optional) Get all contact form entries (for admin dashboard)
// @route   GET /api/contact
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact entries.'
    });
  }
};
