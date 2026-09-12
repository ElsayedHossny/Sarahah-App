import { Router } from "express";
import * as authorsServices from "./authors.service.js";

const authorsRouter = Router();

authorsRouter.post("/", async (req, res) => {
  const result = await authorsServices.insertAuthor();
  res.json({
    message: "inserted author",
    result,
  });
});

export default authorsRouter;
