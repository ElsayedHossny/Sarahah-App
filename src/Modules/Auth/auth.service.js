import UserRepository from "../../DB/Repositories/user.repository.js";
import {
  compareTwoHashs,
  hash,
} from "../../common/Utils/Security/hash.security.js";
import {
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from "../../common/Utils/Error/exception.error.js";
import {
  decryptionSymmetric,
  encryptionSymmetric,
} from "../../common/Utils/Security/encryption.security.js";
import { envConfig } from "../../Config/env.config.js";
import { generateToken } from "../../common/Utils/token.utils.js";

/**
find 
findById
findOne 

create 
insertMany
save 'objectId' new instance from userModel
 */

const authRepo = new UserRepository();
const { user: userEnvConfig, admin: adminEnvConfig } = envConfig.jwt;

const baseCheckLogin = async (body) => {
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

export const registerUser = async (body) => {
  const { firstName, lastName, email, password, gender, age, phone, role } =
    body;
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
    role,
  });
};

export const LoginAdminUser = async (body) => {
  const result = await baseCheckLogin(body);

  let secret, expiresIn;
  switch (result.role) {
    case "user":
      secret = userEnvConfig.access_token_secret;
      expiresIn = userEnvConfig.access_token_expires_in;
      break;
    case "admin":
      secret = adminEnvConfig.access_token_secret;
      expiresIn = adminEnvConfig.access_token_expires_in;
      break;
    default:
      throw new Error("role is not correct");
  }

  // generate token
  const token = generateToken(
    {
      _id: result._id,
      email: result.email,
      role: result.role,
    },
    secret,
    {
      expiresIn,
    },
  );

  return { result, token };
};

export const userLoginOnly = async (body) => {
  const result = await baseCheckLogin(body);
  if (result.role !== "user") {
    throw new ForbiddenException("You are not allowed to sign in as a user", {
      requiredRole: "user",
      currentRole: result.role,
    });
  }
  // generate token
  const token = generateToken(
    {
      _id: result._id,
      email: result.email,
      role: result.role,
    },
    userEnvConfig.access_token_secret,
    {
      expiresIn: userEnvConfig.access_token_expires_in,
    },
  );

  return { result, token };
};

export const adminLoginOnly = async (body) => {
  const result = await baseCheckLogin(body);

  // console.log("result", result);
  // console.log("sdsd:::", result.role);

  if (result.role !== "admin") {
    throw new ForbiddenException("You are not allowed to sign in as an admin", {
      requiredRole: "admin",
      currentRole: result.role,
    });
  }
  // generate token
  const token = generateToken(
    {
      _id: result._id,
      email: result.email,
      role: result.role,
    },
    adminEnvConfig.access_token_secret,
    {
      expiresIn: adminEnvConfig.access_token_expires_in,
    },
  );

  return { result, token };
};
