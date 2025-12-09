import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { signup } from "../controller/auth/signup.ts";
import { login } from "../controller/auth/login.ts";
import { verifyEmailOtp } from "../controller/auth/verifyEmailOtp.ts";
import { logout } from "../controller/auth/logout.ts";

async function authRoutes(fastify: FastifyInstance) {
  // Public routes
  fastify.post(
    "/signup",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const body = request.body as {
          name: string;
          email: string;
          password: string;
          role: string;
        };
        const result = await signup(body);
        return result;
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );

  fastify.post(
    "/login",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const body = request.body as {
          email: string;
          password: string;
          role: string;
        };
        const result = await login(body as any);
        return result;
      } catch (error: any) {
        return reply.status(401).send({ error: error.message });
      }
    }
  );

  fastify.post(
    "/verify-email",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const body = request.body as {
          email: string;
          otp: string;
          role: string;
        };
        const result = await verifyEmailOtp(body);
        return result;
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }
  );

  // Protected route - Logout with JWT verification
  fastify.post(
    "/logout",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // Get and validate token from Authorization header
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return reply.status(401).send({
            error: "Missing or invalid authorization header",
          });
        }

        const token = authHeader.replace("Bearer ", "");

        // Verify JWT token
        let decoded: any;
        try {
          decoded = fastify.jwt.verify(token);
        } catch (err) {
          return reply.status(401).send({ error: "Invalid or expired token" });
        }

        const userId = decoded?.userId;
        const role = decoded?.role;

        if (!userId || !role) {
          return reply.status(400).send({
            error: "Could not retrieve User ID or Role from token",
          });
        }

        // Call logout handler
        const result = await logout(userId, role);
        return result;
      } catch (error) {
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );
}

export default authRoutes;
