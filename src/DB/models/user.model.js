import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    min: [3, "First name must be at 3 chatacters long"],
    max: [30, "First name must be at 30 chatacters long"],
    trim: true,
    lowercase: true,
  },
  lasttName: {
    type: String,
    required: true,
    minLength: [3, "Last name must be at 3 chatacters long"],
    maxLength: [30, "Last name must be at 30 chatacters long"],
    trim: true,
    uppercase: true,
  },
  fullName: { type: String },
  email: {
    type: String,
    required: true,
    index: { name: "idx_email_unique", unique: true },
  },
  password: {
    type: String,
    required: true,
    set: (val) => `${val}##${val.length}`,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "other"],
    default: "other",
  },
  age: {
    type: Number,
    min: [3, "Age must be at least 18"],
    max: [30, "Age must be at least 100"],
  },
  profilePicture: String,
});

const userModel = mongoose.model("userModel", UserSchema);

export default userModel;
