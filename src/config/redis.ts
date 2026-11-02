import 'dotenv/config';
import { createClient } from 'redis';

const redis_url = process.env.REDIS_URL;
if (!redis_url) {
  throw new Error('Redis URL not avaliable');
}

const redis = createClient({
  url: redis_url,
});

redis.on('error', (error: Error) => {
  console.error('Redis error:', error);
});

export default redis;
