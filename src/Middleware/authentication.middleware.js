import UserRepository from "../DB/Repositories/user.repository.js";
import { UnauthorizedException } from "../common/Utils/Error/exception.error.js";
import {
  decodeAndVerifyToken,
  decodeToken,
} from "../common/Utils/token.utils.js";
import { envConfig } from "../Config/env.config.js";

// Create a user repository instance
const userRepo = new UserRepository();

export const authentication = async (req, res, next) => {
  // 1. Get the Authorization header from the request not (authentication)
  const { authorization } = req.headers;

  // 2. Check if the Authorization header exists
  if (!authorization) {
    throw new UnauthorizedException("Authorization header is missing");
  }

  // 3. Extract the Bearer prefix and the JWT token
  // Expected format: "Bearer <token>"
  const [prefix, token] = authorization.split(" ");

  // 4. Validate the Bearer prefix and ensure the token exists
  if (prefix !== "Bearer" || !token) {
    throw new UnauthorizedException("Invalid Bearer token format");
  }

  const userDataFromDB = await decodeToken(token);

  console.log("userDataFromDB", userDataFromDB);

  // 8. Attach the authenticated user to the request object
  req.authUser = userDataFromDB;

  // 9. Pass control to the next middleware or route handler
  next();
};
