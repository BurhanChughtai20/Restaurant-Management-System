"use client";

import React, { useState, useCallback } from "react";
import DynamicContent from "./Title";
import FormInput from "./FormInput";
import { useAuthNavigation } from "@/auth";
import { useVerifyEmailMutation } from "@/app/store/api/authApi";
import { useAlert } from "./DynamicAlert";
import ButtonCom from "./Button";
import { Role } from "@/app/store/api";

const CLASSES = {
  wrapper: "mx-auto w-[95%] md:max-w-md shadow-input rounded-2xl bg-white p-6 md:p-8 dark:bg-black border border-neutral-100 dark:border-neutral-800",
  form: "my-8",
  inputSpacing: "mb-6",
  submitBtnWrapper: "flex justify-center",
  submitBtn: "w-full max-w-xs text-white rounded-md h-10 font-medium dark:bg-zinc-800 shadow-input disabled:opacity-50 disabled:cursor-not-allowed transition-opacity",
  bottomTextWrapper: "text-center mt-4",
  resendLink: "font-bold text-black dark:text-white hover:underline cursor-pointer",
};

export function EmailVerifyForm() {
  const { goToDashboard, goToSignup } = useAuthNavigation();
  const { showAlert } = useAlert();
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<Role>(Role.Admin);
  const [otp, setOtp] = useState<string>("");

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  // Load stored email and role from signup
  React.useEffect(() => {
    const storedEmail = localStorage.getItem("signupEmail") || "";
    const storedRole = (localStorage.getItem("signupRole") as Role) || Role.Admin;
    setEmail(storedEmail);
    setRole(storedRole);
  }, []);

  const getErrorMessage = useCallback((err: unknown) => {
    if (err && typeof err === "object" && "data" in err) {
      const e = err as { data?: { message?: string }; error?: string };
      return e.data?.message || e.error || "Verification failed.";
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
        goToSignup();
        return;
      }

      try {
        const response = await verifyEmail({
  email: email,
  otp: otp,    // Changed key name from token to otp
  role: role,
}).unwrap();

        if (response.token) localStorage.setItem("authToken", response.token);

        showAlert("Email verified successfully!", "success");

        // Cleanup
        localStorage.removeItem("signupEmail");
        localStorage.removeItem("signupRole");

        goToDashboard();
      } catch (err: unknown) {
        showAlert(getErrorMessage(err), "error");
      }
    },
    [otp, email, role, verifyEmail, showAlert, getErrorMessage, goToDashboard, goToSignup]
  );

  return (
    <div className={CLASSES.wrapper}>
      <DynamicContent as="h2">Verify Your Email</DynamicContent>
      <DynamicContent as="p" className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        We&apos;ve sent a code to{" "}
        {email ? <span className="font-medium text-black dark:text-white">{email}</span> : "your email"}.
      </DynamicContent>

      <form className={CLASSES.form} onSubmit={handleSubmit}>
        <FormInput
          id="otp"
          label="Verification Code"
          placeholder="Enter 4-digit code"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          containerClassName={CLASSES.inputSpacing}
          maxLength={6}
        />

        <div className={CLASSES.submitBtnWrapper}>
          <ButtonCom
            text={isLoading ? "Verifying..." : "Verify OTP →"}
            htmlType="submit"
            type="default"
            gradient
            className={CLASSES.submitBtn}
            disabled={isLoading}
          />
        </div>
      </form>

      <div className={CLASSES.bottomTextWrapper}>
        <DynamicContent as="span" className="text-xs">
          Didn&apos;t receive the code?{" "}
          <button type="button" className={CLASSES.resendLink}>
            Resend Code
          </button>
        </DynamicContent>
      </div>
    </div>
  );
}
