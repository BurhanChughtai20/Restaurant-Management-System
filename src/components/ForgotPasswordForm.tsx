"use client";

import React, { useState, useCallback } from "react";
import DynamicContent from "./Title";
import FormInput from "./FormInput";
import { useAuthNavigation } from "@/auth";
import { useForgotPasswordMutation } from "@/app/store/api/authApi";
import { useAlert } from "./DynamicAlert";
import ButtonCom from "./Button";

const UI_TEXT = {
  title: "Forgot Password?",
  description:
    "No worries! Enter your email and we will send you a reset link.",
  submitLabel: "Send Reset Link",
  backLabel: "Back to Login",
};

const FORGOT_FIELDS = [
  {
    id: "email",
    label: "Recovery Email",
    placeholder: "you@example.com",
    type: "email",
  },
] as const;

const CLASSES = {
  wrapper:
    "mx-auto w-[95%] md:max-w-md shadow-input rounded-2xl bg-white p-6 md:p-8 dark:bg-black border border-neutral-100 dark:border-neutral-800",
  form: "my-8",
  inputSpacing: "mb-6",
  submitBtn:
    "relative group/btn w-full text-white rounded-md h-10 font-medium bg-black dark:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity",
  backLink:
    "flex items-center justify-center gap-2 hover:opacity-80 transition-opacity cursor-pointer",
  backText: "text-xs",
};

export function ForgotPasswordForm() {
  const { goToLogin } = useAuthNavigation();
  const { showAlert } = useAlert();

  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
        showAlert("Valid email is required", "error");
        return;
      }

      try {
        await forgotPassword({ email }).unwrap();
        showAlert("Password reset link sent to your email!", "success");
        setEmail("");
      } catch (err: unknown) {
        const errorMessage =
          err && typeof err === "object" && "data" in err
            ? (err as { data?: { message?: string } }).data?.message ||
              "Failed to send reset link"
            : "Failed to send reset link. Please try again.";

        showAlert(errorMessage, "error");
      }
    },
    [email, forgotPassword, showAlert],
  );

  return (
    <div className={CLASSES.wrapper}>
      <DynamicContent as="h2">{UI_TEXT.title}</DynamicContent>
      <DynamicContent as="p" className="mt-2">
        {UI_TEXT.description}
      </DynamicContent>

      <form className={CLASSES.form} onSubmit={handleSubmit}>
        <FormInput
          id="email"
          label="Recovery Email"
          placeholder="you@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          containerClassName={CLASSES.inputSpacing}
        />
        <ButtonCom
          text={isLoading ? "Sending..." : UI_TEXT.submitLabel}
          type="default"
          gradient={true}
          onClick={() => {}}
          className={CLASSES.submitBtn}
          disabled={isLoading}
        />
      </form>

      <button onClick={goToLogin} className={CLASSES.backLink}>
        <DynamicContent as="span" className={CLASSES.backText}>
          &larr; {UI_TEXT.backLabel}
        </DynamicContent>
      </button>
    </div>
  );
}
