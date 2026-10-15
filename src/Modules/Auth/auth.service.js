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
import {
  decodeToken,
  generateSecretAndExpiresInToken,
  generateToken,
} from "../../common/Utils/token.utils.js";
import { TokenTypeEnum } from "../../common/constants.js";

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
////////////////////////////////////////////////////////////////////////////
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

  // generate token
  const { secret, expiresIn } = generateSecretAndExpiresInToken(
    TokenTypeEnum.ACCESS,
    result.role,
  );
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

  // generate refresh token
  const { secret: refreshsecret, expiresIn: refreshexpiresIn } =
    generateSecretAndExpiresInToken(TokenTypeEnum.REFRESH, result.role);
  const refreshToken = generateToken(
    {
      _id: result._id,
      email: result.email,
      role: result.role,
    },
    refreshsecret,
    {
      expiresIn: refreshexpiresIn,
    },
  );

  return { result, token, refreshToken };
};

export const refreshToken = async (token) => {
  const user = await decodeToken(token, "", TokenTypeEnum.REFRESH);

  const { secret, expiresIn } = generateSecretAndExpiresInToken(
    TokenTypeEnum.ACCESS,
    user.role,
  );
  // generate Access Token
  const NewAccessToken = generateToken(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    secret,
    {
      expiresIn,
    },
  );

  // console.log("NewAccessToken:::", NewAccessToken);

  return NewAccessToken;
};
////////////////////////////////////////////////////////////////////////////////
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

  // console.log(token);

  // generate refresh token
  const refreshToken = generateToken(
    {
      _id: result._id,
      email: result.email,
      role: result.role,
    },
    userEnvConfig.refresh_token_secret,
    {
      expiresIn: userEnvConfig.refresh_token_expires_in,
    },
  );
  return { result, token, refreshToken };
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

  // generate refresh token
  const refreshToken = generateToken(
    {
      _id: result._id,
      email: result.email,
      role: result.role,
    },
    adminEnvConfig.refresh_token_secret,
    {
      expiresIn: adminEnvConfig.refresh_token_expires_in,
    },
  );

  return { result, token, refreshToken };
};
