// redis connection
import { createClient } from "redis";
import { redisConfig } from "../../Config/redis.config.js";

export const client = createClient(redisConfig);

export const redisConnection = async () => {
  try {
    await client.connect();
    console.log("Redis connection");
  } catch (error) {
    console.log("Error in Redis connection", error);
  }
};
