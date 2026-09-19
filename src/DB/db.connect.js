import mongoose from "mongoose";
import { envConfig } from "../Config/env.config.js";

const dbConnection = async () => {
  try {
    await mongoose.connect(envConfig.database.uri);
    console.log("database connection");
  } catch (error) {
    console.log("Error in database connection", error);
  }
};

export default dbConnection;
