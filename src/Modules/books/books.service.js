import booksCollection from "../../DB/models/books.model.js";

export const insertBook = async (body) => {
  const { title, author, year, genres } = await body;
  const insert = await booksCollection.insertOne({
    title,
    author,
    year,
    genres,
  });
  return insert;
};

export const insertManyBooks = async (body) => {
  const Books = await booksCollection.insertMany(body);
  return Books;
};

export const addIndex = async () => {
  const index = await booksCollection.createIndex(
    { title: 1 },
    { name: "idx_books_title" },
  );
  return index;
};

export const updateBytitle = async (titleparam, data) => {
  const index = await booksCollection.updateOne(
    { title: { $eq: titleparam } },
    { $set: data },
  );
  return index;
};

export const findBytitle = async (title) => {
  const book = await booksCollection.findOne({
    title: { $eq: title },
  });
  return book;
};

export const findAllBookByYears = async (body) => {
  const { From, To } = body;
  const books = await booksCollection
    .aggregate([
      {
        $match: {
          year: {
            $gte: From,
            $lte: To,
          },
        },
      },
    ])
    .toArray();
  return books;
};

export const findBookswheregenre = async (genre) => {
  const books = await booksCollection
    .find({
      genres: { $elemMatch: { $eq: genre } },
    })
    .toArray();
  return books;
};

export const findBookswhereNotIncludegenre = async (exclude) => {
  const { ex1, ex2 } = exclude;
  const books = await booksCollection
    .find({
      genres: { $nin: [ex1, ex2] },
    })
    .toArray();
  return books;
};

export const skip_limit = async () => {
  const books = await booksCollection
    .find()
    .skip(2)
    .limit(3)
    .sort({ year: -1 })
    .toArray();
  return books;
};

export const year_integer = async () => {
  const books = await booksCollection.find().sort({ year: 1 }).toArray();
  return books;
};

export const deleteBooksBeforeyear = async (body) => {
  const yearparam = Number(body);
  const books = await booksCollection.deleteMany({
    year: {
      $lt: yearparam,
    },
  });
  return books;
};

export const findBooksAfterYear = async (body) => {
  const yearparam = Number(body);
  const books = await booksCollection
    .aggregate([
      {
        $match: {
          year: {
            $gte: yearparam,
          },
        },
      },
      { $sort: { year: -1 } },
    ])
    .toArray();
  return books;
};

export const findBooksAfterYearGroup = async (body) => {
  const yearparam = Number(body);
  const books = await booksCollection
    .aggregate([
      {
        $match: {
          year: {
            $gte: yearparam,
          },
        },
      },
      {
        $project: {
          _id: 0,
          title: 1,
          author: 1,
          year: 1,
        },
      },
    ])
    .toArray();
  return books;
};

export const findBooksBySeparateArray = async () => {
  const books = booksCollection
    .aggregate([
      {
        $unwind: "$genres",
      },
      {
        $project: {
          _id: 0,
          title: 1,
          genres: 1,
        },
      },
    ])
    .toArray();
  return books;
};

export const bookJoinLogs = async () => {
  const books = await booksCollection
    .aggregate([
      {
        $lookup: {
          from: "logs",
          localField: "_id",
          foreignField: "book_id",
          as: "logs",
        },
      },
    ])
    .toArray();
  return books;
};
