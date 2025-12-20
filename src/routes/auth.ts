import type { FastifyInstance } from "fastify";
import { signup } from "../controller/auth/signup.ts";
import { login } from "../controller/auth/login.ts";
import { verifyEmailOtp } from "../controller/auth/verifyEmailOtp.ts";
import { logout } from "../controller/auth/logout.ts"; 
import { forgotPassword } from "../controller/auth/forgotPassword.ts";
import { verifyOtpAndResetPassword } from "../controller/auth/verifyOtpAndResetPassword.ts";
import { deleteAccount } from "../controller/auth/deleteAccount.ts"; 
import type { Role } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.ts";

interface SignupBody { name: string; email: string; password: string; role: Role; }
interface LoginBody { email: string; password: string; role: Role; }
interface VerifyEmailBody { email: string; otp: string; role: Role; }
interface ForgotPasswordBody { email: string; }
interface ResetPasswordBody { otp: string; password: string; }
interface DeleteAccountBody { role: Role; }

async function authRoutes(fastify: FastifyInstance) {

  fastify.post<{ Body: SignupBody }>(
    "/signup",
    asyncHandler(async (req, reply) => {
      const result = await signup(req.body);
      return reply.status(201).send(result);
    })
  );

  fastify.post<{ Body: LoginBody }>(
    "/login",
    asyncHandler(async (req, reply) => {
      const result = await login(req.body);
      return reply.send(result);
    })
  );

  fastify.post<{ Body: VerifyEmailBody }>(
    "/verify-email",
    asyncHandler(async (req, reply) => {
      const result = await verifyEmailOtp(req.body);
      return reply.send(result);
    })
  );

  fastify.post(
    "/logout",
    asyncHandler(async (req, reply) => {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return reply.status(401).send({ error: "Missing or invalid token" });
      }

      const token = authHeader.replace("Bearer ", "");
      const decoded: any = fastify.jwt.verify(token);

      const { userId, role } = decoded;
      if (!userId || !role) {
        return reply.status(400).send({ error: "Could not get userId/role from token" });
      }

      const result = await logout(userId, role);
      return reply.send(result);
    })
  );

  fastify.post<{ Body: ForgotPasswordBody }>(
    "/forgot-password",
    asyncHandler(async (req, reply) => {
      const result = await forgotPassword(req.body);
      return reply.send(result);
    })
  );

  fastify.post<{ Body: ResetPasswordBody }>(
    "/reset-password",
    asyncHandler(async (req, reply) => {
      const result = await verifyOtpAndResetPassword(req.body);
      return reply.send(result);
    })
  );

  fastify.delete<{ Body: DeleteAccountBody }>(
    "/delete-account",
    asyncHandler(async (req, reply) => {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return reply.status(401).send({ error: "Missing or invalid token" });
      }

      const token = authHeader.replace("Bearer ", "");
      const result = await deleteAccount(token, req.body.role);
      return reply.send(result);
    })
  );
}

export default authRoutes;