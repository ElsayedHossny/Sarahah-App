import argon2 from "argon2";

export const hash = (plainText) => {
  return argon2.hash(plainText);
};
export const compareTwoHashs = async (hash, plainText) => {
  return argon2.verify(hash, plainText);
};
