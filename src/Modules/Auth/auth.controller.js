import { Router } from "express";

const authRouter = Router();

authRouter.get("/", (req, res, next) => {
  res.json({ message: "auth :::::" });
});

authRouter.post("/signup", (req, res, next) => {
  res.json({ message: "signup :::::" });
});

authRouter.post("/signin", (req, res, next) => {
  res.json({ message: "signin :::::" });
});

export default authRouter;
