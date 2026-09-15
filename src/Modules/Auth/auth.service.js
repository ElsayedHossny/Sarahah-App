import userModel from "../../DB/models/user.model.js";
import { encryption } from "../../Utils/Security/encryption.security.js";

/**
find 
findById
findOne 

create 
insertMany
save 'objectId' new instance from userModel
 */

export const registerUser = async (body) => {
  const { firstName, lastName, email, password, gender, age, phone } = body;
  // 1- check if email exist
  const isExist = await userModel.findOne({ email });
  if (isExist) {
    throw new Error("Email is Already Exist. ");
  }
  console.log(phone);

  const phoneEncryption = encryption(phone);
  console.log(phoneEncryption);

  const [iv, chipertext] = phoneEncryption.split(":");

  console.log(iv, chipertexts);

  return userModel.create({
    firstName,
    lastName,
    email,
    password,
    gender,
    age,
    phone: phoneEncryption,
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
