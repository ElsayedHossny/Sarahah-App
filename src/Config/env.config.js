import dotenv from "dotenv";

// console.log("sasasasasasasa::::::", `${process.env.NODE_ENV}.env`);

dotenv.config({ path: [`.${process.env.NODE_ENV}.env`, ".env"] });

export const envConfig = {
  database: {
    uri: process.env.DB_URI_LOCAL ?? "mongodb://127.0.0.1:27017/test-db",
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY,
    iv: parseInt(process.env.IV_LENGTH),
  },
};
