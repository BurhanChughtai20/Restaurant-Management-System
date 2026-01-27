"use client";

import React, { useState, useCallback } from "react";
import DynamicContent from "./Title";
import FormInput from "./FormInput";
import { useAuthNavigation } from "@/auth";
import { useResetPasswordMutation } from "@/app/store/api/authApi";
import { useAlert } from "./DynamicAlert";
import { useSearchParams } from "next/navigation";
import ButtonCom from "./Button";

const UI_TEXT = {
  title: "Reset your password",
  description: "Strong passwords include numbers, letters, and symbols.",
  submitLabel: "Update Password",
  backLabel: "Back to Login",
};

const RESET_FIELDS = [
  {
    id: "password",
    label: "New Password",
    placeholder: "••••••••",
    type: "password",
  },
  {
    id: "confirmPassword",
    label: "Confirm New Password",
    placeholder: "••••••••",
    type: "password",
  },
] as const;

const CLASSES = {
  wrapper:
    "mx-auto w-[95%] md:max-w-md shadow-input rounded-2xl bg-white p-6 md:p-8 dark:bg-black border border-neutral-100 dark:border-neutral-800",
  form: "my-8",
  inputSpacing: "mb-4",
  submitBtn:
    "w-full text-white rounded-md h-10 font-medium bg-black dark:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed",
  backBtn:
    "flex items-center justify-center gap-2 hover:opacity-80 transition-opacity cursor-pointer",
  backText: "text-xs text-black dark:text-white font-bold",
};

type FormState = {
  password: string;
  confirmPassword: string;
};

export function ResetPasswordForm() {
  const { goToLogin } = useAuthNavigation();
  const { showAlert } = useAlert();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState<FormState>({
    password: "",
    confirmPassword: "",
  });

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setFormData((prev) => ({ ...prev, [id]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (formData.password.length < 6) {
        showAlert("Password must be at least 6 characters", "error");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        showAlert("Passwords do not match", "error");
        return;
      }

      const token = searchParams.get("token");
      if (!token) {
        showAlert("Invalid reset link", "error");
        return;
      }

      try {
        await resetPassword({
          token,
          password: formData.password,
        }).unwrap();

        showAlert("Password reset successful!", "success");
        goToLogin();
      } catch (error: unknown) {
        let message = "Password reset failed. Please try again.";

        if (
          typeof error === "object" &&
          error !== null &&
          "data" in error &&
          typeof (error as { data?: { message?: string } }).data?.message ===
            "string"
        ) {
          message = (error as { data: { message: string } }).data.message;
        }

        showAlert(message, "error");
      }
    },
    [formData, resetPassword, searchParams, showAlert, goToLogin]
  );

  return (
    <div className={CLASSES.wrapper}>
      <DynamicContent as="h3">{UI_TEXT.title}</DynamicContent>
      <DynamicContent as="p" className="mt-2 text-xs">
        {UI_TEXT.description}
      </DynamicContent>

      <form className={CLASSES.form} onSubmit={handleSubmit}>
        {RESET_FIELDS.map((field) => (
          <FormInput
            key={field.id}
            {...field}
            value={formData[field.id]}
            onChange={handleChange}
            disabled={isLoading}
            containerClassName={CLASSES.inputSpacing}
          />
        ))}

        <ButtonCom
          text={isLoading ? "Updating..." : UI_TEXT.submitLabel}
          type="default"
          htmlType="submit"
          gradient
          className={CLASSES.submitBtn}
          disabled={isLoading}
        />
      </form>

      <button onClick={goToLogin} className={CLASSES.backBtn}>
        <DynamicContent as="span" className={CLASSES.backText}>
          &larr; {UI_TEXT.backLabel}
        </DynamicContent>
      </button>
    </div>
  );
}
