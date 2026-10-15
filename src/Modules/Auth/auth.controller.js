import { Router } from "express";
import * as authServices from "./auth.service.js";
import { login, register } from "./auth.validation.js";
import { ValidationMiddleWare } from "../../Middleware/validation.middleware.js";

const authRouter = Router();

authRouter.post(
  "/signup",
  ValidationMiddleWare(register),
  async (req, res, next) => {
    const result = await authServices.registerUser(req.validate.body);
    res
      .status(201)
      .json({ message: "User registered successfully", user: result });
  },
);

// Login general
authRouter.post(
  "/signin",
  ValidationMiddleWare(login),
  async (req, res, next) => {
    // console.log(req.validate);
    const { result, token, refreshToken } = await authServices.LoginAdminUser(
      req.validate.body,
    );

    // console.log(refreshToken);

    res.status(200).json({
      message: "User login successfully",
      userName: result.fullName,
      accessToken: token,
      refreshToken: refreshToken,
    });
  },
);

// Login user only
authRouter.post(
  "/user/signin",
  ValidationMiddleWare(login),
  async (req, res, next) => {
    // console.log(req.validate);

    const { result, token } = await authServices.userLoginOnly(
      req.validate.body,
    );

    // console.log(result);

    res.status(200).json({
      message: "User login successfully",
      userName: result.fullName,
      token: token,
    });
  },
);

// Admin user only
authRouter.post(
  "/admin/signin",
  ValidationMiddleWare(login),
  async (req, res, next) => {
    // console.log(req.validate);

    const { result, token } = await authServices.adminLoginOnly(
      req.validate.body,
    );

    // console.log(result);

    res.status(200).json({
      message: "User login successfully",
      userName: result.fullName,
      token: token,
    });
  },
);

authRouter.get("/refreshtoken", async (req, res, next) => {
  const { refreshtokenhead } = req.headers;

  if (!refreshtokenhead) {
    throw new UnauthorizedException("Authorization header is missing");
  }
  const NewAccessToken = await authServices.refreshToken(refreshtokenhead);

  res.status(200).json({
    message: "Generate New Token successfully",
    accessToken: NewAccessToken,
  });
});

export default authRouter;
