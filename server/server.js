const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const config = require("./config/config.js");
const app = express();
dotenv.config();

// Enhanced CORS configuration for separate frontend/backend setup
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Frontend port
      "http://localhost:4000", // Admin frontend port
      config.cors_origin1, // Your existing config
      config.cors_origin2, // Your existing config
    ].filter(Boolean), // Remove undefined values
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
    optionsSuccessStatus: 200, // Support legacy browsers
  }),
);

// Handle preflight OPTIONS requests
app.options("*", cors());

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());

const connectDB = require("./db/db.js");
connectDB();

// Imported Routes
const authRoutes = require("./routes/authRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const orderAdminRoutes = require("./routes/orderAdminRoutes.js");
const contactUsRoutes = require("./routes/contactUsRoute.js");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/orders", orderAdminRoutes);
app.use("/api/contact", contactUsRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Backend APIs of VDFoods",
    creator: "Harsh Dodiya | Krish Prajapati",
    Github: config.github1 || "Krish Prajapati",
    GitHub: config.github2 || "Harsh Dodiya",
    apiDocs: "/api",
    status: "Running",
    timestamp: new Date().toISOString(),
  });
});

// Add a health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Add a debug endpoint to check cookies and headers
app.get("/api/debug/auth", (req, res) => {
  res.status(200).json({
    cookies: req.cookies,
    headers: {
      authorization: req.headers.authorization,
      cookie: req.headers.cookie,
    },
    adminToken: req.cookies.adminToken ? "Present" : "Missing",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// Handle 404 routes
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

const PORT = config.port || 5000;
app.listen(PORT, () => {
  console.log(`⚙  Server is running at port: ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});
