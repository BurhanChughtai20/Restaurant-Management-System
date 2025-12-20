import Fastify, { type FastifyError } from "fastify";
import fastifyHelmet from "@fastify/helmet";
import fastifyCompress from "@fastify/compress";
import fastifyCookie from "@fastify/cookie";
import fastifyCaching from "@fastify/caching";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import fastifyResponseValidation from "@fastify/response-validation";
import registerAuthenticate from "./middleware/authenticate.ts";

export async function buildApp() {
  const fastify = Fastify({ logger: true });

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error("JWT_SECRET missing");

  await fastify.register(fastifyHelmet);
  await fastify.register(fastifyCompress);
  await fastify.register(fastifyCaching, {
    privacy: fastifyCaching.privacy.PRIVATE,
    expiresIn: 60 * 1000,
  });
  await fastify.register(fastifyCookie);
  await fastify.register(fastifyJwt, { secret: jwtSecret });
  await registerAuthenticate(fastify);
  await fastify.register(fastifyCors, { origin: true });
  await fastify.register(fastifyResponseValidation);

  fastify.setErrorHandler((error, req, reply) => {
    req.log.error(error);

    const statusCode =
      (error as FastifyError).statusCode ?? 500;

    const message =
      error instanceof Error
        ? error.message
        : "Internal Server Error";

    reply.status(statusCode).send({
      statusCode,
      message,
    });
  });

  fastify.get("/", async () => ({ status: "OK" }));

  return fastify;
}
