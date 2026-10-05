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

authRouter.post(
  "/signin",
  ValidationMiddleWare(login),
  async (req, res, next) => {
    console.log(req.validate);

    const result = await authServices.loginUser(req.validate.body);
    res.status(200).json({ message: "User login successfully", user: result });
  },
);

export default authRouter;
