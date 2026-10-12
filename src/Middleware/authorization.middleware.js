/**
 * 1- user login then
 * 2- data login enter validation middleware if true continue then
 * 3- create token and send token to front-end in request
 *
 * * get user profile
 * 1- get token and verify authentication middleware
 * 2- req.authUser =userData include (role)
 *
 * * Authorization middleware
 * logInUserRole = req.authUser.role
 * after this i access to role make things
 */

import { ForbiddenException } from "../common/Utils/Error/exception.error.js";

export const authorization = (roles = []) => {
  return (req, res, next) => {
    const loggedInUserRole = req.authUser.role;
    // loggedInUserRole return Error if we don't go to Authentication After Authorization
    if (!roles.includes(loggedInUserRole)) {
      throw new ForbiddenException(
        "You are not authorized to access this resource",
        {
          requiredRoles: roles[0],
          currentRole: req.authUser.role,
        },
      );
    }
    next();
  };
};
