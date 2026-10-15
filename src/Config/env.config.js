import dotenv from "dotenv";

// console.log("sasasasasasasa::::::", `${process.env.NODE_ENV}.env`);

// refer folder env
dotenv.config({ path: [`.${process.env.NODE_ENV}.env`, ".env"] });

export const envConfig = {
  database: {
    uri: process.env.DB_URI_LOCAL ?? "mongodb://127.0.0.1:27017/test-db",
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY,
    iv: parseInt(process.env.IV_LENGTH),
  },
  jwt: {
    user: {
      access_token_secret: process.env.USER_ACCESS_TOKEN_SECRET,
      access_token_expires_in: process.env.USER_ACCESS_TOKEN_EXPIRES_IN,
      refresh_token_secret: process.env.USER_REFRESH_TOKEN_SECRET,
      refresh_token_expires_in: process.env.USER_REFRESH_TOKEN_EXPIRES_IN,
    },
    admin: {
      access_token_secret: process.env.ADMIN_ACCESS_TOKEN_SECRET,
      access_token_expires_in: process.env.ADMIN_ACCESS_TOKEN_EXPIRES_IN,
      refresh_token_secret: process.env.ADMIN_REFRESH_TOKEN_SECRET,
      refresh_token_expires_in: process.env.ADMIN_REFRESH_TOKEN_EXPIRES_IN,
    },
  },
};
