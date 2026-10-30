import "./Config/env.config.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRouter from "./Modules/Auth/auth.controller.js";
import userRouter from "./Modules/User/user.controller.js";
import messageRouter from "./Modules/Messages/messages.controller.js";
import dbConnection from "./DB/db.connect.js";
import globalErrorHandler from "./Middleware/global-error-handler.middleware.js";
import { redisConnection } from "./common/Clients/redis.client.js";
import { EmailConnection } from "./common/Clients/email.client.js";

const app = express();

app.use(cors(), helmet(), express.json());

dbConnection();
redisConnection();
EmailConnection();

app.get("/", (req, res) => {
  res.json({ message: "Hello World :::::" });
});

app.use("/uploads", express.static("uploads"));

// Router middlewares
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

// handle Router Not Found
app.use((req, res) => {
  res.status(404).json({ message: "Router Not Found" });
});
// handle Error
app.use(globalErrorHandler);
// Server Connect

console.log("PORT:", process.env.PORT);

const server = app.listen(process.env.PORT, () => {
  console.log("Server is running on port:", server.address().port);
});

server.on("error", (error) => {
  console.error("Server error:", error);
});

app.listen(process.env.PORT, () => {
  console.log("Server is running ::");
});
