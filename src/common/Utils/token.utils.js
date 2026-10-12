import jwt from "jsonwebtoken";
import { envConfig } from "../../Config/env.config.js";
import { BadRequestException } from "./Error/exception.error.js";
import UserRepository from "../../DB/Repositories/user.repository.js";

const jwtConfig = envConfig.jwt;
const userRepo = new UserRepository();
// why we use functions single source of truth
export const generateToken = (payload, secret, options) => {
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token, secret, options) => {
  return jwt.verify(token, secret, options);
};

export const decodeAndVerifyToken = (token, options) => {
  const decodeToken = jwt.decode(token, options);
  console.log("decodeToken", decodeToken);

  if (!decodeToken || !decodeToken.role) {
    throw new BadRequestException("Invalid token payload", {
      field: "role",
      reason: "Missing required claim",
    });
  }
  return verifyToken(token, secret);
};

export const decodeToken = async (token, options, tokenType) => {
  const decodedData = decodeAndVerifyToken(token, options);
  const user = await userRepo.findDocumentById(decodedData._id);
  if (!user) {
    throw new UnauthorizedException("User not found");
  }
  return user;
};
