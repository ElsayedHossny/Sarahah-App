import userModel from "../../DB/models/user.model.js";
import UserRepository from "../../DB/Repositories/user.repository.js";
import { decryptionSymmetric } from "../../Utils/Security/encryption.security.js";

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

const userRepo = new UserRepository();

export const updatedProfile = async (body, userId) => {
  const { email } = body;
  return userRepo.updateOneWithSave(userId, email, body);
};

export const deleteProfile = async (userId) => {
  return userRepo.findOneAndUpdateDocument(userId);
};

export const findProfileById = async (userId) => {
  const user = await userRepo.findDocumentById(userId);
  if (!user) {
    throw new Error("Invalid User Id");
  }
  // Decryption
  const { phone } = user;
  const phoneDecrypt = decryptionSymmetric(phone);
  user.phone = phoneDecrypt;

  return user;
};

export const findAllUsers = async (userId) => {
  const users = await userRepo.findAllDocuments();
  users.map((user) => {
    const { phone } = user;
    const phoneDecrypt = decryptionSymmetric(phone);
    user.phone = phoneDecrypt;
  });

  return users;
};
