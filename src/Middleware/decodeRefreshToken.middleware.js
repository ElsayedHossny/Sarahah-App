import UserRepository from "../DB/Repositories/user.repository.js";
import { UnauthorizedException } from "../common/Utils/Error/exception.error.js";
import { decodeToken } from "../common/Utils/token.utils.js";
import { TokenTypeEnum } from "../common/constants.js";

// Create a user repository instance
const userRepo = new UserRepository();

export const decodeRefreshToken = async (req, res, next) => {
  // 1. Get the Authorization header from the request not (authentication)
  const { refreshtokenhead } = req.headers;

  // 2. Check if the Authorization header exists
  if (!refreshtokenhead) {
    throw new UnauthorizedException("refreshtokenhead header is missing");
  }

  // 3. Extract the Bearer prefix and the JWT token
  // Expected format: "Bearer <token>"
  const [prefix, token] = refreshtokenhead.split(" ");

  // 4. Validate the Bearer prefix and ensure the token exists
  if (prefix !== "Bearer" || !token) {
    throw new UnauthorizedException("Invalid Bearer token format");
  }

  const { user, decodedDataToken } = await decodeToken(
    token,
    "",
    TokenTypeEnum.REFRESH,
  );

  req.UserData = user;
  // Refresh token information
  req.refreshTokenData = decodedDataToken;

  // 9. Pass control to the next middleware or route handler
  next();
};
