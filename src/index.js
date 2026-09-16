import express from "express";
import authRouter from "./Modules/Auth/auth.controller.js";
import userRouter from "./Modules/User/user.controller.js";
import messageRouter from "./Modules/Messages/messages.controller.js";
import dbConnection from "./DB/db.connect.js";
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
app.use((err, req, res, next) => {
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});
// Server Connect
app.listen(3000, () => {
  console.log("Server is running ::");
});

console.log(process.env);
