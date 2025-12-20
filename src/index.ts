import "dotenv/config";
import { buildApp } from "./app.ts";
import { prisma } from "./libs/prisma.ts";
import { connectRedis } from "./libs/redis.ts";
import { registerRoutes } from "./routes/route.ts";

async function startServer() {
  const fastify = await buildApp();

   await prisma.$connect();
  fastify.log.info("Prisma PostgreSQL connected");

   await connectRedis();
  fastify.log.info("Redis connected");

   await registerRoutes(fastify);

  const port = Number(process.env.PORT) || 3000;

   await fastify.listen({
    port,
    host: "0.0.0.0",
  });

  fastify.log.info(`🚀 Server running at http://localhost:${port}`);
}

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
