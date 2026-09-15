import crypto from "node:crypto";

const ENCRYPTION_KEY = Buffer.from(
  "7f3a9c2e81d64b05f2a7e93c4d8b1a60e5f9472c3a1d8e6b9f0c5a27d4e8136b",
  "hex",
);

const IV_LENGTH = 16;

export const encryption = (plaintext) => {
  const iv = crypto.randomBytes(IV_LENGTH);

  const ciphertext = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);

  let encrypt = ciphertext.update(plaintext, "utf-8", "hex");
  encrypt += ciphertext.final("hex");

  return `${iv.toString("hex")}:${encrypt}`;
};

export const decryption = (IvCipher) => {
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
