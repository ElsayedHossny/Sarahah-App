import userModel from "../../DB/models/user.model.js";
import { decryption } from "../../Utils/Security/encryption.security.js";

/** 
updateOne => return modifiedCount 
updateMany => return modifiedCount
findOneAndUpdate => return profile After or before Updated option
findByIdAndUpdate => return profile After or before Updated option
save = (ObjectId) = > the best return profile After Updated Only

/////////////////////////////////////////////////////////////////////////////////////////////

deleteOne => return modifiedCount 
deleteMany => return modifiedCount
findOneAnddelete => return profile After or before Updated option
findByIdAnddelete => return profile After or before Updated option
 */

export const updatedProfile = async (body, userId) => {
  const { email } = body;
  const user = await userModel.findById(userId);

  if (!user) {
    throw new Error("Invalid User Id");
  }
  if (email) {
    const existingUser = await userModel.findOne({
      email,
      _id: { $ne: userId },
    });

    if (existingUser) {
      throw new Error("Email Already Exist Please Enter Another Email");
    }
  }

  Object.assign(user, body);
  return user.save();
};

export const deleteProfile = async (userId) => {
  return userModel.findByIdAndDelete(userId);
};

export const findProfileById = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) {
    throw new Error("Invalid User Id");
  }
  // Decryption
  const { phone } = user;
  const phoneDecrypt = decryption(phone);
  user.phone = phoneDecrypt;

  return user;
};
