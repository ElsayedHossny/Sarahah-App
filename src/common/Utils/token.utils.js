import jwt from "jsonwebtoken";
import { envConfig } from "../../Config/env.config.js";
import {
  BadRequestException,
  UnauthorizedException,
} from "./Error/exception.error.js";
import UserRepository from "../../DB/Repositories/user.repository.js";
import { roleEnum, TokenTypeEnum } from "../constants.js";
import { getRedis } from "../Services/redis.service.js";

const { user: userEnvConfig, admin: adminEnvConfig } = envConfig.jwt;

const userRepo = new UserRepository();
// why we use functions single source of truth
export const generateToken = (payload, secret, options) => {
  return jwt.sign(payload, secret, options);
};
export const verifyToken = (token, secret, options) => {
  return jwt.verify(token, secret, options);
};
////////////////////////////////////////////////////////////////////////////////////////

export const decodeToken = async (
  token,
  options,
  tokenType = TokenTypeEnum.ACCESS,
) => {
  const decodeToken = jwt.decode(token, options);

  // console.log("tokenType", tokenType);

  if (!decodeToken || !decodeToken.role) {
    throw new BadRequestException("Invalid token payload", {
      field: "role",
      reason: "Missing required claim",
    });
  }

  const { secret } = generateSecretAndExpiresInToken(
    tokenType,
    decodeToken.role,
  );
  // console.log("secret", secret);

  const decodedData = verifyToken(token, secret);

  const isTokenBlockList = await getRedis(`bl_${tokenType}_${decodedData.jti}`);
  if (isTokenBlockList) {
    throw new UnauthorizedException("Token is Revoked...please login again", {
      message: "This token is revoked, try to re-login",
      statusCode: 401,
      errorCode: "UNAUTHORIZED",
      data: null,
    });
  }

  const user = await userRepo.findDocumentById(decodedData._id);

  if (!user) {
    throw new UnauthorizedException("User not found");
  }

  return { user, decodedDataToken: decodeToken };
};

// generate secret and expiration time
export const generateSecretAndExpiresInToken = (tokenType, role) => {
  const tokenSecretType = `${tokenType}_token_secret`;
  const expirationTime = `${tokenType}_token_expires_in`;

  let secret, expiresIn;
  switch (role) {
    case roleEnum.USER:
      secret = userEnvConfig[tokenSecretType];
      expiresIn = userEnvConfig[expirationTime];
      return { secret, expiresIn };
    case roleEnum.ADMIN:
      secret = adminEnvConfig[tokenSecretType];
      expiresIn = adminEnvConfig[expirationTime];
      return { secret, expiresIn };
    default:
      throw new Error("Role is not correct");
  }
};
