import { Router } from "express";

import * as booksServices from "./books.service.js";

const booksRouter = Router();

booksRouter.post("/", async (req, res, next) => {
  const { title, author, year, genres } = req.body;

  const result = await booksServices.insertBook({
    title,
    author,
    year,
    genres,
  });
  res.status(201).json({ message: "inserted Book ", result });
});

booksRouter.post("/batch", async (req, res, next) => {
  const Books = req.body;
  const result = await booksServices.insertManyBooks(Books);
  res.status(200).json({ message: "success inserted Books ", result });
});

booksRouter.post("/index", async (req, res, next) => {
  const result = await booksServices.addIndex();
  res.status(200).json({ message: "success to add index to title", result });
});

booksRouter.patch("/:title", async (req, res, next) => {
  const { title } = req.params;
  const data = req.body;
  const result = await booksServices.updateBytitle(title, data);
  res.status(200).json({
    message: "Book updated successfully",
    result,
  });
});

booksRouter.get("/title", async (req, res, next) => {
  const { title } = req.query;
  const result = await booksServices.findBytitle(title);
  res.status(200).json({
    result,
  });
});

booksRouter.get("/year", async (req, res, next) => {
  const { from, to } = req.query;
  const From = Number(from);
  const To = Number(to);
  const result = await booksServices.findAllBookByYears({ From, To });
  res.status(200).json({
    result,
  });
});

booksRouter.get("/genre", async (req, res, next) => {
  const { genre } = req.query;
  console.log(genre);

  const result = await booksServices.findBookswheregenre(genre);
  res.status(200).json({
    result,
  });
});

booksRouter.get("/exclude-genres", async (req, res, next) => {
  const exclude = req.query;
  console.log(exclude);

  const result = await booksServices.findBookswhereNotIncludegenre(exclude);
  res.status(200).json({
    result,
  });
});

booksRouter.get("/skip-limit", async (req, res, next) => {
  const result = await booksServices.skip_limit();
  res.status(200).json({
    result,
  });
});

booksRouter.get("/year_integer", async (req, res, next) => {
  const result = await booksServices.year_integer();
  res.status(200).json({
    result,
  });
});

booksRouter.get("/delete-before-year", async (req, res, next) => {
  const { year } = req.query;

  const result = await booksServices.deleteBooksBeforeyear(year);
  res.status(200).json({
    result,
  });
});

booksRouter.get("/sorting-after-year", async (req, res, next) => {
  const { year } = req.query;

  const result = await booksServices.findBooksAfterYear(year);
  res.status(200).json({
    result,
  });
});

booksRouter.get("/group-after-year", async (req, res, next) => {
  const { year } = req.query;

  const result = await booksServices.findBooksAfterYearGroup(year);
  res.status(200).json({
    result,
  });
});
booksRouter.get("/unwind-array", async (req, res, next) => {
  const result = await booksServices.findBooksBySeparateArray();
  res.status(200).json({
    result,
  });
});

booksRouter.get("/book-Join-Logs", async (req, res, next) => {
  const result = await booksServices.bookJoinLogs();
  res.status(200).json({
    result,
  });
});

export default booksRouter;
