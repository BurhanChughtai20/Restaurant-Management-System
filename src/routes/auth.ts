import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  signup,
  login,
  logout,
  forgotPassword,
  verifyOtpAndResetPassword,
  verifyEmailOtp,
  deleteAccount,
} from "../shared/index.ts";

import type { Role } from "@prisma/client";
import type {
  SignupBody,
  LoginBody,
  VerifyEmailBody,
  ForgotPasswordBody,
  ResetPasswordBody,
  DeleteAccountBody,
} from "../shared/index.ts";

import { extractAuthPayload } from "../utils/auth.util.ts";

async function authRoutes(fastify: FastifyInstance) {

  function registerPost<T>(path: string, handler: (body: T) => Promise<any>) {
  fastify.post<{ Body: T }>(path, async (req, reply) => {
    const body = req.body as T;
    const result = await handler(body);
    return reply.send(result);
  });
}


  registerPost<SignupBody>("/signup", signup);
  registerPost<LoginBody>("/login", login);
  registerPost<VerifyEmailBody>("/verify-email", verifyEmailOtp);
  registerPost<ForgotPasswordBody>("/forgot-password", forgotPassword);
  registerPost<ResetPasswordBody>("/reset-password", verifyOtpAndResetPassword);

  fastify.post("/logout", async (req, reply) => {
    const payload = extractAuthPayload(req, fastify);
    if (!payload) return reply.status(401).send({ error: "Invalid or missing token" });

    return reply.send(await logout(payload.userId, payload.role as Role));
  });

  fastify.delete<{ Body: DeleteAccountBody }>("/delete-account", async (req, reply) => {
    const payload = extractAuthPayload(req, fastify);
    if (!payload) return reply.status(401).send({ error: "Invalid or missing token" });

    return reply.send(await deleteAccount(payload.userId, req.body.role));
  });
}

export default authRoutes;
