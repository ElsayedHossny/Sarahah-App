import { Router } from "express";

const messageRouter = Router();

messageRouter.get("/", (req, res, next) => {
  res.json({ message: "message Good" });
});

export default messageRouter;
