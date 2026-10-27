import { envConfig } from "./env.config.js";

export const emailConfig = {
  pool: true,
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use TLS from the start (required for port 465)
  auth: {
    user: envConfig.email.senderEmailOtp,
    pass: envConfig.email.senderPasswordOtp,
  },
};
