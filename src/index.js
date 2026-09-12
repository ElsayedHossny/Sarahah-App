import express from "express";
import authorsRouter from "./Modules/authors/authors.controller.js";
import booksRouter from "./Modules/books/books.controller.js";
import { dbConnection } from "./DB/db.connect.js";
import { setupDB } from "./DB/db.createCollections.js";
import logsRouter from "./Modules/logs/logs.controller.js";
const app = express();

app.use(express.json());

dbConnection();

await setupDB();

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});
// Router middlewares
app.use("/collection/authors", authorsRouter);
app.use("/collection/books", booksRouter);
app.use("/collection/logs", logsRouter);

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
