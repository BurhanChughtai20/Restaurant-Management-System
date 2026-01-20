// middleware/authenticate.ts
import fp from 'fastify-plugin';
import type { FastifyRequest, FastifyReply } from 'fastify';

export default fp(async (fastify) => {
  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.status(401).send({
          message: 'Unauthorized',
          error: err instanceof Error ? err.message : err,
        });
      }
    }
  );
});
