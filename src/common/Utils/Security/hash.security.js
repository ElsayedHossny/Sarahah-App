import argon2 from "argon2";
import bcrypt from "bcrypt";

export const hash_argon2 = (plainText) => {
  return argon2.hash(plainText);
};
export const compareTwoHashs_argon2 = async (hash, plainText) => {
  return argon2.verify(hash, plainText);
};

export const hashBcrypt = (plainText, salt) => {
  return bcrypt.hash(plainText, salt);
};
export const compareTwoHashsBcrypt = async (plainText, hash) => {
  return bcrypt.compare(plainText, hash);
};
