import { Router } from "express";
import * as userServices from "./user.service.js";
import { authentication } from "../../Middleware/authentication.middleware.js";
import { authorization } from "../../Middleware/authorization.middleware.js";
import { roleEnum } from "../../common/constants.js";
import { multerUpload } from "../../Middleware/multer.middleware.js";
import { multerValidation } from "../../Middleware/MulterValidation.middleware.js";

const userRouter = Router();

userRouter.get("/", (req, res, next) => {
  res.json({ message: "User Good" });
});

userRouter.patch(
  "/update",
  authentication,
  authorization([roleEnum.USER]),
  async (req, res, next) => {
    const data = req.body;
    const result = await userServices.updatedProfile(data, req.authUser._id);
    if (result === null) {
      throw new Error("Invalid User Id");
    }
    res.json({ message: "sucessfully updated ", result });
  },
);

userRouter.delete(
  "/delete",
  authentication,
  authorization([roleEnum.ADMIN, roleEnum.USER]),
  async (req, res, next) => {
    const result = await userServices.deleteProfile(req.authUser._id);
    if (result === null) {
      throw new Error("Invaild User Id");
    }
    res.json({ message: "User Is Deleted" });
  },
);

userRouter.get(
  "/userprofile",
  authentication,
  authorization([roleEnum.USER, roleEnum.ADMIN]),
  async (req, res, next) => {
    const result = await userServices.findProfileById(req.authUser._id);
    res.json({ message: "User Profile", result });
  },
);

userRouter.get(
  "/alluserprofiles",
  authentication,
  authorization([roleEnum.ADMIN]),
  async (req, res, next) => {
    const result = await userServices.findAllUsers();
    res.json({ message: "all User Profile", result });
  },
);

// fields([
//     { name: "image", maxCount: 1 },
//     { name: "image2", maxCount: 2 },
//   ])

userRouter.post(
  "/profile-picture",
  authentication,
  multerUpload({ desiredPath: "profiles" }).single("profile"),
  multerValidation,
  async (req, res, next) => {
    const file = req.file;
    const { authUser } = req;

    const result = await userServices.updatedProfilePicure(authUser, file);
    res.json({
      message: "profile-picture uploaded sucessfully",
      result,
    });
  },
);

userRouter.post(
  "/upload",
  multerUpload({ desiredPath: "Covers" }).single("image"),
  multerValidation,
  async (req, res, next) => {
    const files = req.files ?? req.file;

    res.json({
      message: "uploaded sucessfully",
      result: files,
    });
  },
);

export default userRouter;
