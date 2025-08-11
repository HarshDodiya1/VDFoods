const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const config = require("./config/config.js");

const app = express();

dotenv.config();
app.use(
  cors({
    origin: [config.cors_origin1, config.cors_origin2],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Imported Routes

// Routes

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Backend APIs of VDFoods",
    creator: "Harsh Dodiya | Krish Prajapati",
    Github: config.github1 || "Krish Prajapati",
    GitHub: config.github2 || "Harsh Dodiya",
  });
});

const port = config.port || 3000;
app.listen(port, () => {
  console.log(`⚙️  Server is running at port: ${config.port}`);
});
