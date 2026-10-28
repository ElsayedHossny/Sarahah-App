import UserRepository from "../../DB/Repositories/user.repository.js";
import {
  compareTwoHashs_argon2,
  compareTwoHashsBcrypt,
  hash_argon2,
  hashBcrypt,
} from "../../common/Utils/Security/hash.security.js";
import {
  BadRequestException,
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
  generateSecretAndExpiresInToken,
  generateToken,
} from "../../common/Utils/token.utils.js";
import { roleEnum, TokenTypeEnum } from "../../common/constants.js";
import {
  calculationTTL,
  delRedis,
  getRedis,
  setRedis,
} from "../../common/Services/redis.service.js";
import { uuid } from "uuidv4";
import { emitter } from "../../common/Services/email.service.js";
import crypto from "node:crypto";
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
  const isPasswordCorrect = await compareTwoHashs_argon2(
    isExist.password,
    password,
  );
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

  const hashPassword = await hash_argon2(password);

  //sending otp
  const OTP = crypto.randomInt(100000, 1000000).toString();

  emitter.emit("sendingOTP-Event", email, OTP);

  const hashOTP = await hashBcrypt(OTP, 10);

  await setRedis({
    key: `email_verification:${email}`,
    value: hashOTP,
    options: { EX: 300 },
  });

  /////////////////////
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

const CompareOTPOnlyToVerify = async (email, otp) => {
  const hashotp = await getRedis(`email_verification:${email}`);
  // Check whether the OTP exists or has expired
  if (!hashotp) {
    throw new BadRequestException("OTP verification failed", {
      field: "otp",
      code: "INVALID_OR_EXPIRED_OTP",
      message: "The OTP is invalid or has expired.",
      suggestion: "Please request a new OTP and try again.",
    });
  }

  // Compare the plain OTP with the stored hash
  const isValid = await compareTwoHashsBcrypt(otp, hashotp);

  if (!isValid) {
    throw new BadRequestException("OTP verification failed", {
      field: "otp",
      code: "INVALID_OR_EXPIRED_OTP",
      message: "The OTP is invalid or has expired.",
      suggestion: "Please request a new OTP and try again.",
    });
  }

  return isValid;
};

export const OTPVerify = async (email, otp) => {
  await CompareOTPOnlyToVerify(email, otp);

  const user = await authRepo.findOneAndUpdateDocument(
    { email },
    {
      isVerifyAcount: true,
    },
    { returnDocument: "after" },
  );

  return user;
};

/// change password
/*
1- forget password
2- reset password
 */

export const forgetPassword = async (email) => {
  // 1- check if exist
  const isExist = await authRepo.findOneDocument({ email });
  if (!isExist) {
    throw new ConflictException("Email Not exists", {
      error: "Email Conflict",
    });
  }
  // 2- update status
  const userNotVerify = authRepo.findOneAndUpdateDocument(
    { email },
    {
      isVerifyAcount: false,
    },
    { returnDocument: "after" },
  );
  // 3- generate OTP
  await generatedAndSetOTPInRedis(email);
  return userNotVerify;
};

const generatedAndSetOTPInRedis = async (email) => {
  const OTP = crypto.randomInt(100000, 1000000).toString();
  // emitter send email
  emitter.emit("sendingOTP-Event", email, OTP);
  const hashOTP = await hashBcrypt(OTP, 10);
  await setRedis({
    key: `email_verification:${email}`,
    value: hashOTP,
    options: { EX: 300 },
  });
};

export const resetPassword = async (email, otp, password) => {
  const result = await CompareOTPOnlyToVerify(email, otp);
  if (!result) {
    throw new BadRequestException("OTP verification failed", {
      field: "otp",
      code: "INVALID_OR_EXPIRED_OTP",
      message: "The OTP is invalid or has expired.",
      suggestion: "Please request a new OTP and try again.",
    });
  }
  const hashPassword = await hash_argon2(password);
  const userAfterUpdated = authRepo.findOneAndUpdateDocument(
    { email },
    {
      isVerifyAcount: true,
      password: hashPassword,
    },
    { returnDocument: "after" },
  );

  return userAfterUpdated;
};
//////////////////////////////////////////////////////////////////////////////////////

//// reset OTP

export const resetOTP = async (email) => {
  const isExist = await authRepo.findOneDocument({ email });
  if (!isExist) {
    throw new ConflictException("Email Not exists", {
      error: "Email Conflict",
    });
  }
  await delRedis(`email_verification:${email}`);
  await generatedAndSetOTPInRedis(email);
};

//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
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
      jwtid: uuid(),
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
      jwtid: uuid(),
    },
  );

  return { result, token, refreshToken };
};

export const refreshToken = async (user) => {
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
      jwtid: uuid(),
    },
  );

  // console.log("NewAccessToken:::", NewAccessToken);

  return NewAccessToken;
};

export const logout = async ({ accessData, refreshData }) => {
  const { exp: accessExpiration, jti: accessId } = accessData;
  const { exp: refreshExpiration, jti: refreshId } = refreshData;

  const accessTTL = calculationTTL(accessExpiration);
  const refreshTTL = calculationTTL(refreshExpiration);

  Promise.all([
    setRedis({
      key: `bl_${TokenTypeEnum.ACCESS}_${accessId}`,
      value: "true",
      options: { EX: accessTTL },
    }),
    setRedis({
      key: `bl_${TokenTypeEnum.REFRESH}_${refreshId}`,
      value: "true",
      options: { EX: refreshTTL },
    }),
  ]);

  return { accessTTL, refreshTTL };
};

////////////////////////////////////////////////////////////////////////////////
export const userLoginOnly = async (body) => {
  const result = await baseCheckLogin(body);
  if (result.role !== roleEnum.USER) {
    throw new ForbiddenException("You are not allowed to sign in as a user", {
      requiredRole: roleEnum.USER,
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
      jwtid: uuid(),
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

  if (result.role !== roleEnum.ADMIN) {
    throw new ForbiddenException("You are not allowed to sign in as an admin", {
      requiredRole: roleEnum.ADMIN,
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
      jwtid: uuid(),
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

export const sendEmailverify = async () => {
  const res = await sendEmail(
    "Testing",
    "elsayedhossny909@icloud.com",
    "<h1>HellokcxljcnvscthyjkhAN</h1>",
  );
  return res;
};
