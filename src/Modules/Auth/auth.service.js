import UserRepository from "../../DB/Repositories/user.repository.js";
import {
  ConflictException,
  UnauthorizedException,
} from "../../Utils/Error/exception.error.js";
import {
  decryptionSymmetric,
  encryptionSymmetric,
} from "../../Utils/Security/encryption.security.js";
import { compareTwoHashs, hash } from "../../Utils/Security/hash.security.js";

/**
find 
findById
findOne 

create 
insertMany
save 'objectId' new instance from userModel
 */

const authRepo = new UserRepository();

export const registerUser = async (body) => {
  const { firstName, lastName, email, password, gender, age, phone } = body;
  // 1- check if email exist
  const isExist = await authRepo.findOneDocument({ email });
  if (isExist) {
    throw new ConflictException("Email already exists", {
      error: "Email Conflict",
    });
  }

  // console.log(phone);

  const phoneEncryption = encryptionSymmetric(phone);

  const hashPassword = await hash(password);

  return authRepo.createOneDocument({
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

  const isExist = await authRepo.findOneDocument({ email });
  if (!isExist) {
    throw new UnauthorizedException("Email Not Exist.");
  }
  const isPasswordCorrect = await compareTwoHashs(isExist.password, password);
  if (!isPasswordCorrect) {
    throw new UnauthorizedException("Email or Password Not Correct.");
  }

  const { phone } = isExist;
  const decryptPhone = decryptionSymmetric(phone);
  isExist.phone = decryptPhone;

  return isExist;
};
