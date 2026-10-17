import { client } from "../Clients/redis.client.js";

export const setRedis = ({ key, value, options }) => {
  return client.set(key, value, options);
};

export const getRedis = (key) => {
  return client.get(key);
};

export const delRedis = (key) => {
  return client.del(key);
};

export const calculationTTL = (expiration) => {
  const currentdate = Math.floor(Date.now() / 1000);
  return expiration - currentdate;
};
