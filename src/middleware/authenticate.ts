import fp from "fastify-plugin";
import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { extractAuthPayload, AuthTokenPayload } from "../utils/auth.util.ts";
import { AUTH_HEADER } from "../utils/auth.constants.ts";

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const authHeader = request.headers["authorization"];

        if (!authHeader) {
          return reply
            .status(401)
            .send({ message: "Unauthorized: Missing Authorization header" });
        }

        if (!authHeader.startsWith(AUTH_HEADER.PREFIX)) {
          return reply
            .status(401)
            .send({ message: `Unauthorized: Authorization header must start with '${AUTH_HEADER.PREFIX}'` });
        }

        let payload: AuthTokenPayload | null = null;

        try {
          payload = extractAuthPayload(request, fastify);
        } catch (err) {
          return reply
            .status(401)
            .send({ message: "Unauthorized: Token verification failed", error: (err as Error).message });
        }

        if (!payload) {
          return reply
            .status(401)
            .send({ message: "Unauthorized: Invalid or expired token" });
        }

        // Attach payload to request
        request.user = payload as any;

      } catch (err) {
        // Catch-all
        return reply
          .status(500)
          .send({ message: "Internal server error in authentication", error: (err as Error).message });
      }
    }
  );
});
