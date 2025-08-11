const mongoose = require("mongoose");

/* =========================
   1. USER SCHEMA
========================= */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String }, // hashed OTP for email verification
    otpExpiry: { type: Date },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // Additional user fields
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: "India" },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);