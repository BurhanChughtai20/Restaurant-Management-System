// utils/auth.util.ts
import type { FastifyRequest, FastifyInstance } from "fastify";
import { AUTH_HEADER } from "./auth.constants.ts";

export interface AuthTokenPayload {
  userId: number;
  role: string;
}

export function extractAuthPayload(
  request: FastifyRequest,
  fastify: FastifyInstance
): AuthTokenPayload | null {
  const header = request.headers.authorization;
  if (!header?.startsWith(AUTH_HEADER.PREFIX)) {
    return null;
  }

  const token = header.slice(AUTH_HEADER.PREFIX.length);
  try {
    return fastify.jwt.verify<AuthTokenPayload>(token);
  } catch (err) {
    return null;
  }
}
