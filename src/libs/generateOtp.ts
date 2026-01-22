import crypto from "crypto";

export function generateOtp(length = 4): string {
  if (length < 4 || length > 10) {
    throw new Error("OTP length must be between 4 and 10 digits");
  }

  const otp = crypto.randomInt(0, 10 ** length);

  return otp.toString().padStart(length, "0");
}
