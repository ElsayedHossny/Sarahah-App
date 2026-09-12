import { db } from "../db.connect.js";

const authorsCollection = db.collection("authors");

export default authorsCollection;
