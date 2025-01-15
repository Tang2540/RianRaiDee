const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectMongoDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in the environment variables");
    }
    await mongoose.connect(uri);
    console.log("db connected");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};

module.exports = connectMongoDB;