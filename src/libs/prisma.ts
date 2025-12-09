import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

/**
 * Database connection string from environment variables
 */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

/**
 * Initialize PostgreSQL adapter with connection string
 */
const adapter = new PrismaPg({ connectionString });

/**
 * Prisma Client singleton instance with PostgreSQL adapter
 * Reused across the entire application for optimal connection pooling
 */
const prisma = new PrismaClient({
  adapter,
  log: ["query", "error", "warn"],
});

export { prisma };
export default prisma;
