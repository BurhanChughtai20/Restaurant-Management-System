import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function registerAuthenticate(fastify: FastifyInstance) {
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        return reply.status(401).send({
          message: "Unauthorized",
          error: err instanceof Error ? err.message : err,
        });
      }
    }
  );
}
