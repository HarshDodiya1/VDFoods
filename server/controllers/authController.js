// authController.js

const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');

const JWT_SECRET = config.jwtSecret;

// Helper function to generate a 4-digit OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Controller for user registration
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    // 1. Basic input validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // 2. Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // 3. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    // 4. Password strength validation (e.g., minimum 8 characters)
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    // 5. Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // 6. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 7. Create a new user instance
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    // 8. Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller for user login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // 2. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'No user found with this email.' });
    }

    // 3. Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password is incorrect.' });
    }

    // 4. Generate a JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    // 5. Send a successful response with the token and user details
    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to send an OTP to a user's email
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Basic input validation
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    // 2. Find the user
    const user = await User.findOne({ email });
    if (!user) {
      // Return a non-specific error to prevent email enumeration
      return res.status(404).json({ message: 'User not found with this email.' });
    }

    // 3. Generate a new OTP and set its expiration
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    // 4. Update the user's document with the new OTP and expiry
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // NOTE: In a real application, you would send this OTP via an email service here.
    // For now, we are just saving it to the database.

    res.status(200).json({ message: 'OTP sent successfully.' });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to verify the OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1. Basic input validation
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    // 2. Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email.' });
    }

    // 3. Check if the provided OTP matches the stored OTP and if it's not expired
    if (user.otp === otp && user.otpExpiry > new Date()) {
      // OTP is valid, update user status
      user.isVerified = true;
      user.otp = undefined; // Clear the OTP
      user.otpExpiry = undefined; // Clear the expiry
      await user.save();

      return res.status(200).json({ message: 'OTP verified successfully.' });
    } else {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to reset the user's password
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // 1. Basic input validation
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required.' });
    }

    // 2. Password strength validation
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters long.' });
    }

    // 3. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 4. Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 5. Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully.' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
