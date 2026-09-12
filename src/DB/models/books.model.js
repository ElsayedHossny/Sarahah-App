import { db } from "../../DB/db.connect.js";

const booksCollection = db.collection("books");

export default booksCollection;
