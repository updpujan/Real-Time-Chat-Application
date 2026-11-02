import 'dotenv/config';
import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error('Redis URL not available');
}

const redis = createClient({
  url: redisUrl,
});

redis.on('error', (error: Error) => {
  console.error('Redis error:', error);
});

export default redis;
