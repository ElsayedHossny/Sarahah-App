import userModel from "../../DB/models/user.model.js";
import { encryptionSymmetric } from "../../Utils/Security/encryption.security.js";
import { compareTwoHashs, hash } from "../../Utils/Security/hash.security.js";

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
  // console.log(phone);

  const phoneEncryption = encryptionSymmetric(phone);

  const hashPassword = await hash(password);

  return userModel.create({
    firstName,
    lastName,
    email,
    password: hashPassword,
    gender,
    age,
    phone: phoneEncryption,
  });
};

export const loginUser = async (body) => {
  const { email, password } = body;

  const isExist = await userModel.findOne({ email });

  if (!isExist) {
    throw new Error("Email or Password Not Correct.");
  }

  const isPasswordCorrect = await compareTwoHashs(isExist.password, password);

  if (!isPasswordCorrect) {
    throw new Error("Email or Password Not Correct.");
  }

  return isExist;
};
