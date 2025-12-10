import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { signup } from "../controller/auth/signup.ts";
import { login } from "../controller/auth/login.ts";
import { verifyEmailOtp } from "../controller/auth/verifyEmailOtp.ts";
import { logout } from "../controller/auth/logout.ts"; 
import { forgotPassword } from "../controller/auth/forgotPassword.ts";
import { verifyOtpAndResetPassword } from "../controller/auth/verifyOtpAndResetPassword.ts";
import { deleteAccount } from "../controller/auth/deleteAccount.ts";

type UserRole = "Admin" | "Order_Taker" | "Shop_Owner";
interface SignupBody {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface LoginBody {
  email: string;
  password: string;
  role: UserRole;
}

interface VerifyEmailBody {
  email: string;
  otp: string;
  role: UserRole;
}

interface ForgotPasswordBody {
  email: string;
}

interface ResetPasswordBody {
  otp: string;
  password: string;
}

interface DeleteAccountBody {
  role: UserRole;
}

async function authRoutes(fastify: FastifyInstance) {

  // Signup
  fastify.post<{ Body: SignupBody }>("/signup", async (request, reply) => {
    try {
      const result = await signup(request.body);
      return reply.send(result);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // Login
  fastify.post<{ Body: LoginBody }>("/login", async (request, reply) => {
    try {
      const result = await login(request.body);
      return reply.send(result);
    } catch (error: any) {
      return reply.status(401).send({ error: error.message });
    }
  });

  // Verify Email OTP
  fastify.post<{ Body: VerifyEmailBody }>("/verify-email", async (request, reply) => {
    try {
      const result = await verifyEmailOtp(request.body);
      return reply.send(result);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  // Logout
  fastify.post("/logout", async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return reply.status(401).send({ error: "Missing or invalid authorization header" });
      }
      const token = authHeader.replace("Bearer ", "");

      const decoded: any = fastify.jwt.verify(token);
      const userId = decoded?.userId;
      const role = decoded?.role;

      if (!userId || !role) {
        return reply.status(400).send({ error: "Could not retrieve User ID or Role from token" });
      }

      const result = await logout(userId, role);
      return reply.send(result);
    } catch (error: any) {
      return reply.status(401).send({ error: error.message });
    }
  });

  // Forgot Password
  fastify.post<{ Body: ForgotPasswordBody }>("/forgot-password", async (request, reply) => {
    try {
      const result = await forgotPassword(request.body);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(err.statusCode || 400).send({ error: err.message });
    }
  });

  // Reset Password
  fastify.post<{ Body: ResetPasswordBody }>("/reset-password", async (request, reply) => {
    try {
      const result = await verifyOtpAndResetPassword(request.body);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(err.statusCode || 400).send({ error: err.message });
    }
  });

  // Delete Account
  fastify.delete<{ Body: DeleteAccountBody }>("/delete-account", async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return reply.status(401).send({ error: "Missing or invalid authorization header" });
      }
      const token = authHeader.replace("Bearer ", "");

      const result = await deleteAccount(token, request.body.role);
      return reply.send(result);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });
}

export default authRoutes;
