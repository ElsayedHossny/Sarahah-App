import { Router } from "express";

import * as logsServices from "./logs.service.js";
import { ObjectId } from "mongodb";
const logsRouter = Router();

logsRouter.post("/capped", async (req, res, next) => {
  const { book_id, action } = req.body;

  const result = await logsServices.insertLog({
    book_id: new ObjectId(book_id),
    action,
  });

  res.status(201).json({
    message: "success add log",
    result,
  });
});
export default logsRouter;
