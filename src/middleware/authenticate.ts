import fp from "fastify-plugin";
import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { extractAuthPayload } from "../utils/auth.util.ts";
import type { AuthTokenPayload } from "../utils/auth.util.ts";
import { AUTH_HEADER } from "../utils/auth.constants.ts";

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        return reply
          .status(401)
          .send({ message: "Unauthorized: Missing Authorization header" });
      }

      if (!authHeader.startsWith(AUTH_HEADER.PREFIX)) {
        return reply
          .status(401)
          .send({
            message: `Unauthorized: Authorization header must start with '${AUTH_HEADER.PREFIX}'`,
          });
      }

      const payload = extractAuthPayload(request, fastify);

      if (!payload) {
        return reply
          .status(401)
          .send({ message: "Unauthorized: Invalid or expired token" });
      }

      request.user = payload;
    }
  );
});
