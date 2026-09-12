import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

const db = client.db("author_books_db");

const dbConnection = async () => {
  try {
    await client.connect();
    console.log("Database connected");
  } catch (error) {
    console.log("DB connection error", error);
  }
};

export { dbConnection, db };
