// 1. Load environment variables first
import 'dotenv/config';

import Fastify from 'fastify';
import fastifyHelmet from '@fastify/helmet';
import fastifyCompressPkg from '@fastify/compress';
import fastifyCookie from '@fastify/cookie';
import fastifyCaching from '@fastify/caching';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import fastifyBearerAuth from '@fastify/bearer-auth';
import fastifyResponseValidation from '@fastify/response-validation';
import authRoutes from "./routes/auth.ts";
import fastifyMysql from '@fastify/mysql';

// Handle CommonJS default export
const fastifyCompress = fastifyCompressPkg.default;

const fastify = Fastify({ logger: true });

// Check for JWT_SECRET now that .env is loaded
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error('JWT_SECRET is not defined in .env');


// --- Plugin Registration ---

// Security headers
await fastify.register(fastifyHelmet);

// Compression
await fastify.register(fastifyCompress, {
  global: true,
  threshold: 1024,
  encodings: ['gzip', 'deflate', 'br']
});

// Caching
await fastify.register(fastifyCaching, {
  privacy: fastifyCaching.privacy.PRIVATE,
  expiresIn: 60 * 1000
});

// Cookie support
await fastify.register(fastifyCookie);

// JWT authentication
await fastify.register(fastifyJwt, { secret: jwtSecret });

// Bearer auth
await fastify.register(fastifyBearerAuth, { keys: new Set([jwtSecret]) });

// CORS
await fastify.register(fastifyCors, { origin: '*' });

// Response validation
await fastify.register(fastifyResponseValidation);

// Test route
fastify.get('/', async () => {
  return { hello: 'world' };
});

const API_PREFIX = process.env.API_PREFIX;
await fastify.register(authRoutes, { prefix: `${API_PREFIX}/auth` });

// Start server
try {
  // Use the PORT variable from .env
  const port = Number(process.env.PORT) || 3000;
  await fastify.listen({ port });
  console.log(`Server running on port ${port}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}