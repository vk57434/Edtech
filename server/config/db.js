const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("Missing MongoDB connection string. Set MONGO_URI in the environment.");
    }

    console.log("🔗 Connecting to MongoDB");
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.name);
    throw error;
  }
};

module.exports = connectDB;
