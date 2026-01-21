// src/types/auth.ts
import type { Role } from "@prisma/client";

export interface SignupBody {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface LoginBody {
  email: string;
  password: string;
  role: Role;
}

export interface VerifyEmailBody {
  email: string;
  otp: string;
  role: Role;
}

export interface ForgotPasswordBody {
  email: string;
}

export interface ResetPasswordBody {
  otp: string;
  password: string;
}

export interface DeleteAccountBody {
  role: Role;
}

export interface AuthTokenPayload {
  userId: string;
  role: Role;
}

export interface UserData {
  name: string;
  email: string;
  password: string;
  role: string;
  otp: string;
  otpExpiresAt: string;
}

export interface OtpData {
  otp: string;
  userId: string;
  expiresAt: string;
  used?: string;
}
