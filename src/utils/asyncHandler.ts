import type { FastifyReply, FastifyRequest } from "fastify";

export function asyncHandler<
  Req = FastifyRequest,
  Res extends FastifyReply = FastifyReply
>(fn: (request: Req, reply: Res) => Promise<any>) {
  return async (request: Req, reply: Res) => {
    try {
      await fn(request, reply);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  };
}
