import 'dotenv/config';
import { createClient } from 'redis';

export const redisClient = createClient({
    username: process.env.REDIS_USERNAME || 'default',
    password: process.env.REDIS_PASSWORD || '',
    socket: {
        host: process.env.REDIS_URL || '127.0.0.1',
        port: Number(process.env.REDIS_PORT) || 6379
    }
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

export async function connectRedis() {
    try {
        await redisClient.connect();
        console.log("Redis connected successfully!");
    } catch (err) {
        console.error("Failed to connect Redis:", err);
    }
}
