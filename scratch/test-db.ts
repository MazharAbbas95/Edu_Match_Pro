import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

async function testConnection() {
  console.log("Testing MongoDB connection...");
  console.log("URI (masked password):", uri?.replace(/:([^@]+)@/, ':****@'));

  if (!uri) {
    console.error("Error: MONGODB_URI is missing from .env file!");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { 
      serverSelectionTimeoutMS: 5000 
    });
    console.log("\x1b[32m%s\x1b[0m", "SUCCESS: Connected to MongoDB Atlas successfully!");
    process.exit(0);
  } catch (err: any) {
    console.error("\x1b[31m%s\x1b[0m", "FAILED: Could not connect to MongoDB Atlas.");
    console.error("Error Name:", err.name);
    console.error("Error Message:", err.message);
    
    if (err.message.includes('ECONNREFUSED') || err.message.includes('queryTxt ETIMEOUT')) {
      console.log("\n\x1b[33mPossible causes:\x1b[0m");
      console.log("1. Your IP is blocked. Go to Atlas -> Network Access -> Add IP -> Allow Access from Anywhere (0.0.0.0/0).");
      console.log("2. Your internet connection is blocking the MongoDB port (27017).");
    } else if (err.message.includes('Authentication failed')) {
      console.log("\n\x1b[33mPossible cause:\x1b[0m");
      console.log("The password or username in your .env file is incorrect.");
    }
    process.exit(1);
  }
}

testConnection();
