import 'dotenv/config';
import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import fastifyHelmet from '@fastify/helmet';
import fastifyCompressPkg from '@fastify/compress';
import fastifyCookie from '@fastify/cookie';
import fastifyCaching from '@fastify/caching';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import fastifyResponseValidation from '@fastify/response-validation';
import authRoutes from './routes/auth.ts';
 import { prisma } from './libs/prisma.ts';
import { connectRedis } from './libs/redis.ts';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { orderTakerSocket } from './sockets/orderTakerSocket.ts';
import orderTakerManagementRoutes from './routes/order_Taker_Management_Admin_Routes.ts';
import chefsManagementRoutes from './routes/chefs_Management_Admin_Routes.ts';

const fastifyCompress = fastifyCompressPkg.default;
const fastify: FastifyInstance = Fastify({ logger: true });

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error('JWT_SECRET is not defined in .env');

await fastify.register(fastifyHelmet);
await fastify.register(fastifyCompress, {
  global: true,
  threshold: 1024,
  encodings: ['gzip', 'deflate', 'br'],
});
await fastify.register(fastifyCaching, {
  privacy: fastifyCaching.privacy.PRIVATE,
  expiresIn: 60 * 1000,
});
await fastify.register(fastifyCookie);
await fastify.register(fastifyJwt, { secret: jwtSecret });
await fastify.register(fastifyCors, { origin: '*' });
await fastify.register(fastifyResponseValidation);

fastify.setErrorHandler((error: any, request, reply) => {
  if (error.statusCode) {
    reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.statusCode === 409 ? 'Conflict' : 'Bad Request',
      message: error.message,
    });
    return;
  }

  request.log.error(error);
  reply.status(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'Something unexpected went wrong on the server.',
  });
});

// --- Test route ---
fastify.get('/', async () => ({ hello: 'world' }));

const API_PREFIX = process.env.API_PREFIX || '/api';
await fastify.register(authRoutes, { prefix: `${API_PREFIX}/auth` });
await fastify.register(orderTakerManagementRoutes, { prefix: `${API_PREFIX}/waiter` });
await fastify.register(chefsManagementRoutes, { prefix: `${API_PREFIX}/chef` });

try {
  await prisma.$connect();
  console.log('Prisma PostgreSQL connected successfully!');
} catch (err) {
  console.error('Failed to connect Prisma:', err);
}

await connectRedis();

const server: http.Server = http.createServer(fastify.server);

const io: SocketIOServer = new SocketIOServer(server, {
  cors: { origin: '*' },
});

orderTakerSocket(io);

io.on('connection', (socket) => {
  console.log('⚡ Socket.IO: Client connected!', socket.id);
});

try {
  const port: number = Number(process.env.PORT) || 3000;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
