import dotenv from "dotenv";

// console.log("sasasasasasasa::::::", `${process.env.NODE_ENV}.env`);

dotenv.config({ path: [`.${process.env.NODE_ENV}.env`, ".env"] });
