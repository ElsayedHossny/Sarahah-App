import { Router } from "express";

import * as authServices from "./auth.service.js";
const authRouter = Router();

authRouter.get("/", (req, res, next) => {
  res.json({ message: "auth :::::" });
});

authRouter.post("/signup", async (req, res, next) => {
  const { firstName, lastName, email, password, gender, age } = await req.body;
  const result = await authServices.registerUser({
    firstName,
    lastName,
    email,
    password,
    gender,
    age,
  });
  res
    .status(201)
    .json({ message: "User registered successfully", user: result });
});

authRouter.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;
  const result = await authServices.loginUser({
    email,
    password,
  });
  res.status(200).json({ message: "User login successfully", user: result });
});

export default authRouter;
