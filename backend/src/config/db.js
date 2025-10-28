// NODE MODULES...
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const dbOptions = {
  dbName: "Expense_Tracker_DB",
  appName: "ExpenseTrackerApp",
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
};

// ESTABLISHES A CONNECTION TO THE MONGOdB DATABASE TO THE MONGOOSE...
export const connectToDatabase = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(MONGODB_URI, dbOptions);

    console.log("MongoDb connected successfuly");
  } catch (err) {
    console.error(" MongoDB connection failed", err);
    throw err;
  }
};

// DISCONNECTS FROM THE MONGODB DATABASE USING MONGOOSE...
export const disconnectFromDatabase = async () => {
  try {
    await mongoose.disconnect();

    console.log("Disconnecting database successfully.");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    console.error("Error to Disconnecting mongoDb database.", error);
  }
};
