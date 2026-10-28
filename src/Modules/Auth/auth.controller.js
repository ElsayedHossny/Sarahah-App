import { Router } from "express";
import * as authServices from "./auth.service.js";
import { login, register } from "./auth.validation.js";
import { ValidationMiddleWare } from "../../Middleware/validation.middleware.js";
import { authentication } from "../../Middleware/authentication.middleware.js";
import { decodeRefreshToken } from "../../Middleware/decodeRefreshToken.middleware.js";

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

authRouter.get("/refreshtoken", decodeRefreshToken, async (req, res, next) => {
  const NewAccessToken = await authServices.refreshToken(req.UserData);

  res.status(200).json({
    message: "Generate New Token successfully",
    accessToken: NewAccessToken,
  });
});

// Logout general
authRouter.post(
  "/signout",
  authentication,
  decodeRefreshToken,
  async (req, res, next) => {
    const result = await authServices.logout({
      accessData: req.decodeUserData,
      refreshData: req.refreshTokenData,
    });
    res.status(200).json({ message: "LoggedOut successfully", result: result });
  },
);

// verify-email
authRouter.get("/verify-email", async (req, res, next) => {
  const { email, otp } = req.body;
  const result = await authServices.OTPVerify(email, otp);
  res.status(200).json({
    success: true,
    message: "OTP verified successfully",
    result: result,
  });
});

/// change password
/*
1- forget password
2- reset password
 */
authRouter.get("/forgetPassword", async (req, res, next) => {
  const { email } = req.body;
  const result = await authServices.forgetPassword(email);
  res.status(200).json({
    success: true,
    message: "Email Exist Check Your Email OTP",
    result: result,
  });
});
authRouter.post("/resetPassword", async (req, res, next) => {
  const { email, otp, password } = req.body;
  const result = await authServices.resetPassword(email, otp, password);
  res.status(200).json({
    success: true,
    message: "Email Exist Check Your Email OTP",
    result: result,
  });
});
//// reset OTP
authRouter.get("/resetOTP", async (req, res, next) => {
  const { email } = req.body;
  const result = await authServices.resetOTP(email);
  res.status(200).json({
    success: true,
    message: "Email Exist Check Your Email OTP",
    result: result,
  });
});

// Login usesr only
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

authRouter.post("/sendmail", async (req, res, next) => {
  const x = await authServices.sendEmailverify();
  res.status(200).json({
    message: "Sended Email Successfully",
    result: x,
  });
});

export default authRouter;
