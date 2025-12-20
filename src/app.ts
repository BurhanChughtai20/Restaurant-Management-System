import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import fastifyHelmet from "@fastify/helmet";
import fastifyCompressPkg from "@fastify/compress";
import fastifyCookie from "@fastify/cookie";
import fastifyCaching from "@fastify/caching";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import fastifyResponseValidation from "@fastify/response-validation";
import registerAuthenticate from "./middleware/authenticate.ts";

const fastifyCompress = fastifyCompressPkg.default;

export async function buildApp(): Promise<FastifyInstance> {
  const fastify: FastifyInstance = Fastify({ logger: true });

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error("JWT_SECRET is not defined in .env");

  await fastify.register(fastifyHelmet);
  await fastify.register(fastifyCompress, { global: true, threshold: 1024, encodings: ["gzip", "deflate", "br"] });
  await fastify.register(fastifyCaching, { privacy: fastifyCaching.privacy.PRIVATE, expiresIn: 60 * 1000 });
  await fastify.register(fastifyCookie);
  await fastify.register(fastifyJwt, { secret: jwtSecret });
  await registerAuthenticate(fastify);
  await fastify.register(fastifyCors, { origin: "*" });
  await fastify.register(fastifyResponseValidation);

  fastify.setErrorHandler((error: any, request, reply) => {
    if (error.statusCode) {
      reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: error.statusCode === 409 ? "Conflict" : "Bad Request",
        message: error.message,
      });
      return;
    }

    request.log.error(error);
    reply.status(500).send({
      statusCode: 500,
      error: "Internal Server Error",
      message: "Something unexpected went wrong on the server.",
    });
  });

  fastify.get("/", async () => ({ hello: "world" }));

  return fastify;
}
