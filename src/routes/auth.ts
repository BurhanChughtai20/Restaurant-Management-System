import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { signup, login, verifyEmailOtp } from "../controller/authController.ts";

async function authRoutes(fastify: FastifyInstance) {

  // Signup
  fastify.post("/signup", async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as { email: string; password: string };
    const user = await signup(body);
    return user;
  });

  // Login
  fastify.post("/login", async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as { email: string; password: string };
    const token = await login(body);
    return { token };
  });

  // Verify email OTP
  fastify.post("/verify-email", async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as { email: string; otp: string };
    const result = await verifyEmailOtp(body);
    return result;
  });
}

export default authRoutes;
