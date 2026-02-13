import 'fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { AuthenticatedUser } from '../shared/index.ts';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }

  interface FastifyRequest {
    user: AuthenticatedUser;
    restaurantId: number;
  }
}
