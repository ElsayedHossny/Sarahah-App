import { Router } from "express";
import * as userServices from "./user.service.js";
import { authentication } from "../../Middleware/authentication.middleware.js";

const userRouter = Router();

userRouter.get("/", (req, res, next) => {
  res.json({ message: "User Good" });
});

userRouter.patch("/update", authentication, async (req, res, next) => {
  const data = req.body;
  const result = await userServices.updatedProfile(data, req.authUser._id);
  if (result === null) {
    throw new Error("Invalid User Id");
  }
  res.json({ message: "sucessfully updated ", result });
});

userRouter.delete("/delete", authentication, async (req, res, next) => {
  const result = await userServices.deleteProfile(req.authUser._id);
  if (result === null) {
    throw new Error("Invaild User Id");
  }
  res.json({ message: "User Is Deleted" });
});

userRouter.get("/userprofile", authentication, async (req, res, next) => {
  const result = await userServices.findProfileById(req.authUser._id);
  res.json({ message: "User Profile", result });
});

userRouter.get("/alluserprofiles", async (req, res, next) => {
  const result = await userServices.findAllUsers();
  res.json({ message: "all User Profile", result });
});

export default userRouter;
