import { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res, next) => {
  res.json({ message: "User Good" });
});

export default userRouter;
