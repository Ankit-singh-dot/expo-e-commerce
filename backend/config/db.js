import mongoose from "mongoose";
import { ENV } from "./env.js";
let isConnected = false;
export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const conn = await mongoose.connect(ENV.DB_URL);
    isConnected = true;

    console.log(` MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};
// export const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(ENV.DB_URL);
//     console.log(`connected to MONGODB : ${conn.connection.host}`);
//   } catch (error) {
//     console.error("db not connected ");
//     process.exit(1);
//   }
// };
