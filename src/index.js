import "./Config/env.config.js";
import express from "express";
import authRouter from "./Modules/Auth/auth.controller.js";
import userRouter from "./Modules/User/user.controller.js";
import messageRouter from "./Modules/Messages/messages.controller.js";
import dbConnection from "./DB/db.connect.js";
import globalErrorHandler from "./Middleware/global-error-handler.middleware.js";
const app = express();

app.use(express.json());

dbConnection();

app.get("/", (req, res) => {
  res.json({ message: "Hello World :::::" });
});

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
app.listen(process.env.PORT, () => {
  console.log("Server is running ::");
});
