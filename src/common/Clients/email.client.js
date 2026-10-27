import nodemailer from "nodemailer";
import { emailConfig } from "../../Config/email.config.js";

export const transporter = nodemailer.createTransport(emailConfig);

export const EmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("Server is ready to take our messages");
  } catch (err) {
    console.error("Verification failed:", err.message);
  }
};
