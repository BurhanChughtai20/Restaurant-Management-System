import "dotenv/config";
import http from "http";
import { buildApp } from "./app.ts";
import { prisma } from "./libs/prisma.ts";
import { connectRedis } from "./libs/redis.ts";
import { registerRoutes } from "./routes/route.ts";
import { orderTakerSocket } from "./controller/sockets/orderTaker.Socket.ts";
import { chefSocket } from "./controller/sockets/chef.Socket.ts";
import { Server as SocketIOServer } from "socket.io";

async function startServer() {
  const fastify = await buildApp();

  await prisma.$connect();
  console.log("Prisma PostgreSQL connected successfully!");
  await connectRedis();

  await registerRoutes(fastify);

  const server = http.createServer(fastify.server);
  const io = new SocketIOServer(server, { cors: { origin: "*" } });

  orderTakerSocket(io);
  chefSocket(io);

  io.on("connection", (socket) => {
    console.log("⚡ Socket.IO: Client connected!", socket.id);
  });

  const port = Number(process.env.PORT) || 3000;
  server.listen(port, () => console.log(`Server running on http://localhost:${port}`));
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
