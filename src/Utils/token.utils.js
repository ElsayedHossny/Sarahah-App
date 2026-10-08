import jwt from "jsonwebtoken";
import { envConfig } from "../Config/env.config.js";

// why we use functions single source of truth
export const generateToken = (payload, options) => {
  return jwt.sign(payload, envConfig.jwt.user.access_token_secret, options);
};

export const verifyToken = (token, options) => {
  return jwt.verify(token, envConfig.jwt.user.access_token_secret, options);
};
