const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    const usedVar = process.env.MONGODB_URI ? "MONGODB_URI" : "MONGO_URI";

    if (!mongoUri) {
      throw new Error(
        "Missing MongoDB connection string. Set MONGODB_URI or MONGO_URI in your environment."
      );
    }

    console.log(`🔗 Connecting to MongoDB using ${usedVar}`);
    await mongoose.connect(mongoUri);

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
