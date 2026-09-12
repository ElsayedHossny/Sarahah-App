import logsCollection from "../../DB/models/logs.model.js";

export const insertLog = async (body) => {
  const insert = await logsCollection.insertOne(body);
  return insert;
};
