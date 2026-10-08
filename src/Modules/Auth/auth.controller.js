import { Router } from "express";
import * as authServices from "./auth.service.js";
import { login, register } from "./auth.validation.js";
import { ValidationMiddleWare } from "../../Middleware/validation.middleware.js";
import { generateToken } from "../../Utils/token.utils.js";
import { envConfig } from "../../Config/env.config.js";

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

authRouter.post(
  "/signin",
  ValidationMiddleWare(login),
  async (req, res, next) => {
    console.log(req.validate);

    const result = await authServices.loginUser(req.validate.body);

    // generate token
    const token = generateToken(
      {
        _id: result._id,
        email: result.email,
        role: result.role,
      },
      {
        expiresIn: "1h",
      },
    );

    res.status(200).json({
      message: "User login successfully",
      userName: result.fullName,
      token: token,
    });
  },
);

export default authRouter;
