import { Router } from "express";
import * as userServices from "./user.service.js";
import { verifyToken } from "../../Utils/token.utils.js";

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

  const { authentication } = req.headers;

  // first must verify Who this person
  let verifyResult;
  try {
    verifyResult = verifyToken(authentication);
  } catch (error) {
    throw new Error(error);
  }
  const result = await userServices.findProfileById(verifyResult._id);
  res.json({ message: "User Profile", result });
});
userRouter.get("/alluserprofiles", async (req, res, next) => {
  const result = await userServices.findAllUsers();
  res.json({ message: "all User Profile", result });
});

export default userRouter;
