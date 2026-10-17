import mongoose from "mongoose";
import { dbConfig } from "../Config/db.config.js";

const dbConnection = async () => {
  try {
    await mongoose.connect(dbConfig.uri);
    console.log("database connection");
  } catch (error) {
    console.log("Error in database connection", error);
  }
};

export default dbConnection;
