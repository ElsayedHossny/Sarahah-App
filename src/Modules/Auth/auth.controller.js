import { Router } from "express";
import * as authServices from "./auth.service.js";
import { BadRequestException } from "../../Utils/Error/exception.error.js";
import { loginSchema, registerSchema } from "./auth.validation.js";

const authRouter = Router();

authRouter.post("/signup", async (req, res, next) => {
  const validationResult = registerSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw new BadRequestException(
      "validation Schema",
      validationResult.error.issues,
    );
  }
  const result = await authServices.registerUser(validationResult.data);
  res
    .status(201)
    .json({ message: "User registered successfully", user: result });
});

authRouter.post("/signin", async (req, res, next) => {
  // Validation Rules
  const validationResult = loginSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw new BadRequestException(
      "validation Schema",
      validationResult.error.issues,
    );
  }
  const result = await authServices.loginUser(validationResult.data);
  res.status(200).json({ message: "User login successfully", user: result });
});

export default authRouter;
