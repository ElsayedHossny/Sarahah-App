import userModel from "../../DB/models/user.model.js";

/**
 *
 * @param { firstName, lastName, email, password, gender, age } body
 * check if Email Exist
 * the if not Exist i will add it
 */

export const registerUser = async (body) => {
  const { firstName, lastName, email, password, gender, age } = body;
  // 1- check if email exist
  const isExist = await userModel.findOne({ email });
  if (isExist) {
    throw new Error("Email is Already Exist. ");
  }
  return userModel.create({
    firstName,
    lastName,
    email,
    password,
    gender,
    age,
  });
};

export const loginUser = async (body) => {
  const { email, password } = body;
  const isExist = await userModel.findOne({ email, password });
  if (!isExist) {
    throw new Error("Email or Password Not Correct.");
  }
  return isExist;
};
