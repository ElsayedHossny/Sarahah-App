import authorsCollection from "../../DB/models/authors.model.js";

export const insertAuthor = async () => {
  const insert = await authorsCollection.insertOne({
    name: "sayed2",
    age: 90,
  });

  return insert;
};
