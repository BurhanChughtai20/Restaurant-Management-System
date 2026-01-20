import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { signup } from "../controller/auth/signup.ts";
import { login } from "../controller/auth/login.ts";
import { logout } from "../controller/auth/logout.ts"; 
import { forgotPassword } from "../controller/auth/forgotPassword.ts";
import { verifyOtpAndResetPassword } from "../controller/auth/verifyOtpAndResetPassword.ts";
import { deleteAccount } from "../controller/auth/deleteAccount.ts"; 
import type { Role } from "@prisma/client";
import { verifyEmailOtp } from "../controller/auth/verifyEmailOtp.ts";

interface SignupBody { name: string; email: string; password: string; role: Role; }
interface LoginBody { email: string; password: string; role: Role; }
interface VerifyEmailBody { email: string; otp: string; role: Role; }
interface ForgotPasswordBody { email: string; }
interface ResetPasswordBody { otp: string; password: string; }
interface DeleteAccountBody { role: Role; }

async function authRoutes(fastify: FastifyInstance) {

  // Signup
  fastify.post<{ Body: SignupBody }>(
    "/signup",
    async (req, reply) => {
      const result = await signup(req.body);
      return reply.status(201).send(result);
    }
  );

  // Login
  fastify.post<{ Body: LoginBody }>(
    "/login",
    async (req, reply) => {
      const result = await login(req.body);
      return reply.send(result);
    }
  );

  // Verify Email OTP
  fastify.post<{ Body: VerifyEmailBody }>(
    "/verify-email",
    async (req, reply) => {
      const result = await verifyEmailOtp(req.body);
      return reply.send(result);
    }
  );

  // Logout
  fastify.post(
    "/logout",
    async (req, reply) => {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return reply.status(401).send({ error: "Missing or invalid token" });
      }

      const token = authHeader.replace("Bearer ", "");
      // Fastify JWT automatically throws error if verification fails
      const decoded: any = fastify.jwt.verify(token);

      const { userId, role } = decoded;
      if (!userId || !role) {
        return reply.status(400).send({ error: "Could not get userId/role from token" });
      }

      const result = await logout(userId, role);
      return reply.send(result);
    }
  );

  // Forgot Password
  fastify.post<{ Body: ForgotPasswordBody }>(
    "/forgot-password",
    async (req, reply) => {
      const result = await forgotPassword(req.body);
      return reply.send(result);
    }
  );

  // Reset Password
  fastify.post<{ Body: ResetPasswordBody }>(
    "/reset-password",
    async (req, reply) => {
      const result = await verifyOtpAndResetPassword(req.body);
      return reply.send(result);
    }
  );

  // Delete Account
  fastify.delete<{ Body: DeleteAccountBody }>(
    "/delete-account",
    async (req, reply) => {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return reply.status(401).send({ error: "Missing or invalid token" });
      }

      const token = authHeader.replace("Bearer ", "");
      const result = await deleteAccount(token, req.body.role);
      return reply.send(result);
    }
  );
}

export default authRoutes;