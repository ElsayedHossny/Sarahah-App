import { db } from "../db.connect.js";

const logsCollection = db.collection("logs");

export default logsCollection;
