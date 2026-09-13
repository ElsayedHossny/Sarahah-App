import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/sarahah-app");
    console.log("database connection");
  } catch (error) {
    console.log("Error in database connection", error);
  }
};

export default dbConnection;
