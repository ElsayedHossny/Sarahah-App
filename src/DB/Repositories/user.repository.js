import BaseRepository from "./base.repository.js";
import userModel from "../models/user.model.js";
import {
  ConflictException,
  NotFoundException,
} from "../../Utils/Error/exception.error.js";

export default class UserRepository extends BaseRepository {
  constructor() {
    super(userModel);
  }
  // UPDATE USER
  async updateOneWithSave(id, email, updates) {
    const user = await this.findDocumentById(id);

    if (!user) {
      throw new NotFoundException("User Not Found", {
        error: "Invalid User Id",
      });
    }

    if (email) {
      const existingUser = await this.findOneDocument({
        email,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        throw new ConflictException(
          "Email Already Exist Please Enter Another Email",
          { error: "This Email Is Already Exist Please Enter Another Email." },
        );
      }
    }

    Object.assign(user, updates);

    return user.save();
  }
}
