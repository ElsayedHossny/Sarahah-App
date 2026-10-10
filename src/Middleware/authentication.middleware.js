import UserRepository from "../DB/Repositories/user.repository.js";
import { UnauthorizedException } from "../Utils/Error/exception.error.js";
import { verifyToken } from "../Utils/token.utils.js";

const userRepo = new UserRepository();

export const authentication = async (req, res, next) => {
  // 1
  const { authentication } = req.headers;
  if (!authentication) {
    throw new UnauthorizedException("Invalid authentication header");
  }

  // 2
  const verifyResult = verifyToken(authentication);

  // 3 get user data because always i depend on data from DB
  const user = await userRepo.findDocumentById(verifyResult._id);
  if (!user) {
    throw new UnauthorizedException("User not found");
  }

  req.authUser = user;
  next();
};
