import type { FastifyInstance } from "fastify";
import { signup } from "../controller/auth/signup.ts";
import { login } from "../controller/auth/login.ts";
import { verifyEmailOtp } from "../controller/auth/verifyEmailOtp.ts";
import { logout } from "../controller/auth/logout.ts"; 
import { forgotPassword } from "../controller/auth/forgotPassword.ts";
import { verifyOtpAndResetPassword } from "../controller/auth/verifyOtpAndResetPassword.ts";
import { deleteAccount } from "../controller/auth/deleteAccount.ts";
import { Role } from "@prisma/client";

interface SignupBody {
  name: string;
  email: string;
  password: string; 
  role: Role;
}

interface LoginBody {
  email: string;
  password: string;
  role: Role;
}

interface VerifyEmailBody {
  email: string;
  otp: string;
  role: Role;
}

interface ForgotPasswordBody {
  email: string;
}

interface ResetPasswordBody {
  otp: string;
  password: string;
}

interface DeleteAccountBody {
  role: Role;
}

async function authRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: SignupBody }>("/signup", async (req, reply) => {
    try { return reply.send(await signup(req.body)); } 
    catch (e: any) { return reply.status(400).send({ error: e.message }); }
  });

  fastify.post<{ Body: LoginBody }>("/login", async (req, reply) => {
    try { return reply.send(await login(req.body)); } 
    catch (e: any) { return reply.status(401).send({ error: e.message }); }
  });

  fastify.post<{ Body: VerifyEmailBody }>("/verify-email", async (req, reply) => {
    try { return reply.send(await verifyEmailOtp(req.body)); } 
    catch (e: any) { return reply.status(400).send({ error: e.message }); }
  });

  fastify.post("/logout", async (req, reply) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) return reply.status(401).send({ error: "Missing or invalid token" });
      const token = authHeader.replace("Bearer ", "");
      const decoded: any = fastify.jwt.verify(token);
      const { userId, role } = decoded;
      if (!userId || !role) return reply.status(400).send({ error: "Could not get userId/role from token" });
      return reply.send(await logout(userId, role));
    } catch (e: any) { return reply.status(401).send({ error: e.message }); }
  });

  fastify.post<{ Body: ForgotPasswordBody }>("/forgot-password", async (req, reply) => {
    try { return reply.send(await forgotPassword(req.body)); } 
    catch (e: any) { return reply.status(e.statusCode || 400).send({ error: e.message }); }
  });

  fastify.post<{ Body: ResetPasswordBody }>("/reset-password", async (req, reply) => {
    try { return reply.send(await verifyOtpAndResetPassword(req.body)); } 
    catch (e: any) { return reply.status(e.statusCode || 400).send({ error: e.message }); }
  });

  fastify.delete<{ Body: DeleteAccountBody }>("/delete-account", async (req, reply) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) return reply.status(401).send({ error: "Missing or invalid token" });
      const token = authHeader.replace("Bearer ", "");
      return reply.send(await deleteAccount(token, req.body.role));
    } catch (e: any) { return reply.status(400).send({ error: e.message }); }
  });
}

export default authRoutes;
