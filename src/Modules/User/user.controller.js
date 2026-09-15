import { Router } from "express";
import * as userServices from "./user.service.js";

const userRouter = Router();

userRouter.get("/", (req, res, next) => {
  res.json({ message: "User Good" });
});

userRouter.patch("/update/:userId", async (req, res, next) => {
  const data = req.body;
  const { userId } = req.params;

  const result = await userServices.updatedProfile(data, userId);
  if (result === null) {
    throw new Error("Invalid User Id");
  }
  res.json({ message: "sucessfully updated ", result });
});

userRouter.delete("/delete/:userId", async (req, res, next) => {
  const { userId } = req.params;

  const result = await userServices.deleteProfile(userId);
  if (result === null) {
    throw new Error("Invaild User Id");
  }
  res.json({ message: "User deleted", result });
});

userRouter.get("/userprofile/:userId", async (req, res, next) => {
  const { userId } = req.params;
  const result = await userServices.findProfileById(userId);
  res.json({ message: "User Profile", result });
});

export default userRouter;
