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
  await fastify.register(registerAuthenticate);
  await fastify.register(fastifyCors, {
  origin: [
    "http://localhost:3000",
    "https://restaurant-management-syste-git-9f0028-chughtaiburhans-projects.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});


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
