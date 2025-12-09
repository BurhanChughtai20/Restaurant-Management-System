import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { signup } from "../controller/auth/signup.ts";
import { login } from "../controller/auth/login.ts";
import { verifyEmailOtp } from "../controller/auth/verifyEmailOtp.ts";
import { logout } from "../controller/auth/logout.ts"; 
import { forgotPassword } from "../controller/auth/forgotPassword.ts";
import { verifyOtpAndResetPassword } from "../controller/auth/verifyOtpAndResetPassword.ts";

async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/signup", async (request: FastifyRequest, reply: FastifyReply) => {
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
  });

  fastify.post("/login", async (request: FastifyRequest, reply: FastifyReply) => {
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
  });

  fastify.post("/verify-email", async (request: FastifyRequest, reply: FastifyReply) => {
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
  });

  fastify.post("/logout", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return reply.status(401).send({ error: "Missing or invalid authorization header" });
      }

      const token = authHeader.replace("Bearer ", "");

      let decoded: any;
      try {
        decoded = fastify.jwt.verify(token);
      } catch (err) {
        return reply.status(401).send({ error: "Invalid or expired token" });
      }

      const userId = decoded?.userId;
      const role = decoded?.role;

      if (!userId || !role) {
        return reply.status(400).send({ error: "Could not retrieve User ID or Role from token" });
      }

      const result = await logout(userId, role);
      return result;
    } catch (error) {
      return reply.status(500).send({ error: "Internal server error" });
    }
  });

  fastify.post("/forgot-password", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { email } = request.body as { email: string };
      return await forgotPassword({ email });
    } catch (err: any) {
      return reply.status(err.statusCode || 400).send({ error: err.message });
    }
  });

  fastify.post("/reset-password", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { otp, newPassword } = request.body as {
        otp: string;
        newPassword: string;
      };
      return await verifyOtpAndResetPassword({ otp, newPassword });
    } catch (err: any) {
      return reply.status(err.statusCode || 400).send({ error: err.message });
    }
  });
}

export default authRoutes;
