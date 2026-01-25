"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useAuthNavigation } from "@/auth";
import { useVerifyEmailMutation } from "@/app/store/api/authApi";
import { useAppDispatch } from "@/app/store/hooks";
import { useAlert } from "./DynamicAlert";
import ButtonCom from "./Button";

export function EmailVerifyForm() {
  const dispatch = useAppDispatch();
  const { goToDashboard } = useAuthNavigation();
  const { showAlert } = useAlert();

  const [otp, setOtp] = useState("");

  const email = useMemo(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("signupEmail") || "";
    }
    return "";
  }, []);

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

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
        showAlert("Please enter a valid OTP", "error");
        return;
      }

      if (!email) {
        showAlert("Email not found. Please signup again.", "error");
        return;
      }

      try {
        const response = await verifyEmail({ email, token: otp }).unwrap();

        if (response.token) {
          // Dispatch token to Redux (you'll need to update this based on your API response structure)
          // If your API returns user data along with token:
          // dispatch(setCredentials({ user: response.user, token: response.token }));

          // For now, just store the token
          localStorage.setItem("authToken", response.token);
        }

        showAlert("Email verified successfully!", "success");

        // Clean up signup email
        localStorage.removeItem("signupEmail");

        goToDashboard();
      } catch (err: unknown) {
        showAlert(getErrorMessage(err), "error");
      }
    },
    [
      otp,
      email,
      verifyEmail,
      dispatch,
      showAlert,
      getErrorMessage,
      goToDashboard,
    ],
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="border p-2 rounded"
        maxLength={6}
      />

      <ButtonCom
        text={isLoading ? "Verifying..." : "Verify Email"}
        type="default"
        gradient={true}
        onClick={() => {}}
        className="bg-blue-500 text-white p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-opacity w-full"
        disabled={isLoading}
      />
    </form>
  );
}
