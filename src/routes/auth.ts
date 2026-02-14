import type { FastifyInstance } from "fastify";
import {
  signup,
  login,
  logout,
  forgotPassword,
  verifyOtpAndResetPassword,
  verifyEmailOtp,
  deleteAccount,
} from "../shared/index.ts";

import { Role } from "@prisma/client";
import type {
  SignupBody,
  LoginBody,
  VerifyEmailBody,
  ForgotPasswordBody,
  ResetPasswordBody,
  DeleteAccountBody,
} from "../shared/index.ts";

import { extractAuthPayload } from "../utils/auth.util.ts";
import { prisma } from "../libs/prisma.ts";
import { getDashboardOverview } from "../controller/auth/getDashboardOverview.ts";

async function authRoutes(fastify: FastifyInstance) {
  function registerPost<T extends object>(
    path: string,
    handler: (body: T) => Promise<any>,
  ) {
    fastify.post<{ Body: T }>(path, async (req, reply) => {
      try {
        const body = req.body as T;

        const result = await handler(body);
        return reply.send(result);
      } catch (error: any) {
        const statusCode = error.statusCode || 400;
        return reply.status(statusCode).send({
          error: error.message || "Internal Server Error",
        });
      }
    });
  }

  registerPost<SignupBody>("/signup", signup);
  registerPost<LoginBody>("/login", login);
  registerPost<VerifyEmailBody>("/verify-email", verifyEmailOtp);
  registerPost<ForgotPasswordBody>("/forgot-password", forgotPassword);
  registerPost<ResetPasswordBody>("/reset-password", verifyOtpAndResetPassword);

  fastify.post("/logout", async (req, reply) => {
    const payload = extractAuthPayload(req, fastify);
    if (!payload) {
      return reply.status(401).send({ error: "Invalid or missing token" });
    }
    const user = await prisma.users.findUnique({
      where: { id: payload.userId },
    });
    if (!user) {
      return reply
        .status(404)
        .send({ error: "User not found or already deleted" });
    }
    const result = await logout(payload.userId, payload.role as Role);
    return reply.send({ message: "Logout successful", details: result });
  });

  fastify.delete<{ Body: DeleteAccountBody }>(
    "/delete-account",
    async (req, reply) => {
      try {
        const payload = extractAuthPayload(req, fastify);
        if (!payload)
          return reply.status(401).send({ error: "Invalid or missing token" });

        const result = await deleteAccount(payload.userId, req.body.role);
        return reply.send(result);
      } catch (err: any) {
        return reply
          .status(err.statusCode || 400)
          .send({ error: err.message || "Internal Server Error" });
      }
    },
  );


    fastify.get("/dashboard-overview", async (req, reply) => {
    try {
      const payload = extractAuthPayload(req, fastify);

      if (!payload || payload.role !== Role.Admin) {
        return reply.status(403).send({
          error: "Access denied. Admin only.",
        });
      }

      const result = await getDashboardOverview();
      return reply.send(result);
    } catch (error: any) {
      return reply.status(error.statusCode || 500).send({
        error: error.message || "Internal Server Error",
      });
    }
  });
}

export default authRoutes;
