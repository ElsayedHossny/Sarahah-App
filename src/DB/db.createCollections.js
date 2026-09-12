import { db } from "./db.connect.js";

export const setupDB = async () => {
  await db.createCollection("books", {
    validator: {
      $jsonSchema: {
        required: ["title"],
        properties: {
          title: {
            bsonType: "string",
            minLength: 1,
          },
        },
      },
    },
  });

  await db.createCollection("logs", { capped: true, size: 1024 * 1024 });
};
