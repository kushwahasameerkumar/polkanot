import RedisClient from "./utils/RedisClient.js";
import config from "./constants/config.js";

const redisClient = new RedisClient(config.REDIS_URL);
await redisClient.connect();

export default redisClient;
