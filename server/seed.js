const mongoose = require("mongoose");
const Product = require("./models/productModel.js");
const products = require("./product.json");
const config = require("./config/config.js");

const MONGO_URI = "mongodb://127.0.0.1:27017/vdfoods"; // change to your DB name/URI

// MongoDB connection
const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected ✅");

    await Product.deleteMany({});
    console.log("Existing products removed ✅");

    // Insert new data
    await Product.insertMany(products);
    console.log("Products inserted ✅");

    // Close the connection
    await mongoose.connect(config.dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected ✅");

    // Insert new data
    await Product.insertMany(products);
    console.log("Products inserted ✅");

    // Close the connection
    mongoose.connection.close();
  } catch (err) {
    console.error("Error inserting products ❌", err);
    mongoose.connection.close();
  }
};

seedData();
