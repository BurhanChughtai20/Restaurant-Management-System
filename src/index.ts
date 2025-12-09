import 'dotenv/config';
import Fastify from 'fastify';
import fastifyHelmet from '@fastify/helmet';
import fastifyCompressPkg from '@fastify/compress';
import fastifyCookie from '@fastify/cookie';
import fastifyCaching from '@fastify/caching';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import fastifyResponseValidation from '@fastify/response-validation';
import authRoutes from "./routes/auth.ts";
import { prisma } from "./libs/prisma.ts";
import { connectRedis } from "./libs/redis.ts";

const fastifyCompress = fastifyCompressPkg.default;
const fastify = Fastify({ logger: true });

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error('JWT_SECRET is not defined in .env');

// --- Plugins ---
await fastify.register(fastifyHelmet);
await fastify.register(fastifyCompress, {
  global: true,
  threshold: 1024,
  encodings: ['gzip', 'deflate', 'br']
});
await fastify.register(fastifyCaching, {
  privacy: fastifyCaching.privacy.PRIVATE,
  expiresIn: 60 * 1000
});
await fastify.register(fastifyCookie);
await fastify.register(fastifyJwt, { secret: jwtSecret });
await fastify.register(fastifyCors, { origin: '*' });
await fastify.register(fastifyResponseValidation);

// --- Global Error Handler ---
fastify.setErrorHandler((error: any, request, reply) => {
  if (error.statusCode) {
    reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.statusCode === 409 ? "Conflict" : "Bad Request",
      message: error.message,
    });
    return;
  }

  // For unexpected 500 errors
  request.log.error(error);
  reply.status(500).send({
    statusCode: 500,
    error: "Internal Server Error",
    message: "Something unexpected went wrong on the server.",
  });
});

// --- Test route ---
fastify.get('/', async () => ({ hello: 'world' }));

// --- Auth Routes ---
const API_PREFIX = process.env.API_PREFIX;
await fastify.register(authRoutes, { prefix: `${API_PREFIX}/auth` });

// --- Prisma Connection Test ---
try {
  await prisma.$connect();
  console.log("Prisma PostgreSQL connected successfully!");
} catch (err) {
  console.error("Failed to connect Prisma:", err);
}

await connectRedis();

// --- Start Server ---
try {
  const port = Number(process.env.PORT) || 3000;
  await fastify.listen({ port });
  console.log(`Server running on port ${port}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
