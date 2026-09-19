import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URI_LOCAL);
    console.log("database connection");
  } catch (error) {
    console.log("Error in database connection", error);
  }
};

export default dbConnection;
