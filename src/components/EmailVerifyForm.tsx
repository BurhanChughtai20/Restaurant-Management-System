"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useAuthNavigation } from "@/auth";
import { useVerifyEmailMutation } from "@/app/store/api";
import { useAlert } from "./DynamicAlert";

export function EmailVerifyForm() {
  const { goToDashboard } = useAuthNavigation();
  const { showAlert } = useAlert();

  const [otp, setOtp] = useState("");

  const email = useMemo(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("signupEmail") || "";
    }
    return "";
  }, []);

  const [verifyEmail, result] = useVerifyEmailMutation();
  const { isLoading } = result;

  const handleAlert = useCallback(
    (message: string, type: "error" | "success") => showAlert(message, type),
    [showAlert],
  );

  const getErrorMessage = useCallback((err: unknown) => {
    if (err && typeof err === "object" && "data" in err) {
      const e = err as { data?: { message?: string }; error?: string };
      return (
        e.data?.message || e.error || "Verification failed. Please try again."
      );
    }
    return "Verification failed. Please try again.";
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!otp || otp.length < 4) {
        return handleAlert("Please enter a valid OTP", "error");
      }

      if (!email) {
        return handleAlert("Email not found. Please signup again.", "error");
      }

      try {
        const response = await verifyEmail({ email, token: otp }).unwrap();

        if (response.token) {
          localStorage.setItem("authToken", response.token);
        }

        handleAlert("Email verified successfully!", "success");
        goToDashboard();
      } catch (err: unknown) {
        handleAlert(getErrorMessage(err), "error");
      }
    },
    [otp, email, verifyEmail, handleAlert, getErrorMessage, goToDashboard],
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="border p-2 rounded"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
      >
        {isLoading ? "Verifying..." : "Verify Email"}
      </button>
    </form>
  );
}
