import { envConfig } from "../../Config/env.config.js";
import { transporter } from "../Clients/email.client.js";
import EventEmitter from "node:events";
export const sendEmail = async ({
  to,
  subject = "",
  message = "",
  attachments = [],
}) => {
  try {
    const info = await transporter.sendMail({
      from: `"No Reply" <${envConfig.email.senderEmailOtp}>`,
      to,
      subject,
      html: message,
      attachments,
    });
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (err) {
    console.error("Error while sending mail:", err);
    return false;
  }
};

export const emitter = new EventEmitter();

emitter.on("sendingOTP-Event", async (email, OTP) => {
  await sendEmail({
    to: email,
    subject: "OTP Verification",
    message: `<h1>Welcome to My App</h1>
        <p>
            Your verification code is:
        </p>
        <h2>${OTP}</h2>
        <p>
            This code will expire in 5 minutes.
        </p>`,
  });
});
