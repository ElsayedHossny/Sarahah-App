import crypto from "node:crypto";
import { envConfig } from "../../Config/env.config.js";

//==================================== Symmetric Encryption =====================================//
const IV_LENGTH = envConfig.encryption.iv;

const ENCRYPTION_KEY = Buffer.from(envConfig.encryption.key, "hex");

export const encryptionSymmetric = (plaintext) => {
  const iv = crypto.randomBytes(IV_LENGTH);

  const ciphertext = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);

  let encrypt = ciphertext.update(plaintext, "utf-8", "hex");
  encrypt += ciphertext.final("hex");

  return `${iv.toString("hex")}:${encrypt}`;
};

export const decryptionSymmetric = (IvCipher) => {
  const [iv, chipertext] = IvCipher.split(":");
  const IvBuffer = Buffer.from(iv, "hex");

  const plaintext = crypto.createDecipheriv(
    "aes-256-cbc",
    ENCRYPTION_KEY,
    IvBuffer,
  );

  let decrypt = plaintext.update(chipertext, "hex", "utf-8");
  decrypt += plaintext.final("utf-8");

  return decrypt;
};
