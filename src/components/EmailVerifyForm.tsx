"use client";

import React, { useState, useCallback } from "react";
import { useAuthNavigation } from "@/auth";
import { useVerifyEmailMutation } from "@/app/store/api/authApi";
import { useAlert } from "./DynamicAlert";
import { FormField, Role } from "@/app/store/api";
import { DynamicCardForm } from "./FormInput";
import { CheckCircle } from "lucide-react";
import { ButtonWithIcon } from "./Button";
import DynamicContent from "./Title";

export function EmailVerifyForm() {
  const { goToDashboard, goToSignup } = useAuthNavigation();
  const { showAlert } = useAlert();

  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<Role>(Role.Admin);
  const [otp, setOtp] = useState<string>("");

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  // Load stored email and role
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

  const handleSubmit = useCallback(async () => {
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
        email,
        otp,
        role,
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
  }, [otp, email, role, verifyEmail, showAlert, getErrorMessage, goToDashboard, goToSignup]);

  const formFields: FormField[] = [
    {
      id: "otp",
      label: "Verification Code",
      placeholder: "Enter 4-digit code",
      type: "text",
      required: true,
      value: otp,
      onChange: (e) => setOtp(e.target.value),
    },
  ];
  return (
    <DynamicCardForm
      title="Verify Your Email"
      description={
        <DynamicContent as="h6" className="text-sm text-neutral-600 dark:text-neutral-400">
          We&apos;ve sent a code to{" "}
          {email ? <span className="font-medium text-black dark:text-white">{email}</span> : "your email"}.
        </DynamicContent>
      }
      fields={formFields}
      actionButton={{
        text: isLoading ? "Verifying..." : "Verify OTP →",
        variant: "default",
        size: "default",
        onClick: handleSubmit,
      }}
      extraHeaderAction={
        <ButtonWithIcon
          text="Verify with Key"
          size="sm"
          variant="outline"
          icon={<CheckCircle size={16} />}
          onClick={handleSubmit}
        />
      }
      footerButtons={[
        {
          text: "Resend Code",
          variant: "link",
          size: "sm",
          type: "button",
          onClick: () => showAlert("Resend functionality coming soon", "info"),
        },
      ]}
    />
  );
}
