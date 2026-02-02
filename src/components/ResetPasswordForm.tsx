"use client";

import React, { useState, useCallback } from "react";
import { useResetPasswordMutation } from "@/app/store/api/authApi";
import { useAuthNavigation } from "@/auth";
import { useAlert } from "./DynamicAlert";
import { DynamicCardForm } from "./FormInput";
import { Key } from "lucide-react";
import { ButtonWithIcon } from "./Button";
import { FormField } from "@/app/store/api";

interface FormState {
  otp: string;
  password: string;
}

const UI_TEXT = {
  title: "Reset your password",
  description: "Strong passwords include numbers, letters, and symbols.",
  submitLabel: "Update Password",
  backLabel: "Back to Login",
};

export function ResetPasswordForm() {
  const { goToLogin } = useAuthNavigation();
  const { showAlert } = useAlert();

  const [formData, setFormData] = useState<FormState>({
    otp: "",
    password: "",
  });

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { id, value } = e.target;
      setFormData((prev) => ({ ...prev, [id]: value }));
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    if (!formData.otp.trim()) return showAlert("OTP is required", "error");
    if (formData.password.length < 6)
      return showAlert("Password too short", "error");

    try {
      await resetPassword(formData).unwrap();
      showAlert("Password reset successfully", "success");
      goToLogin();
    } catch (error: unknown) {
      let message = "Password reset failed";
      if (typeof error === "object" && error !== null && "data" in error) {
        const errData = (error as { data?: { message?: string } }).data;
        if (errData?.message) message = errData.message;
      }
      showAlert(message, "error");
    }
  }, [formData, resetPassword, showAlert, goToLogin]);

  const formFields: FormField[] = [
    {
      id: "otp",
      label: "OTP Code",
      placeholder: "Enter OTP",
      type: "text",
      required: true,
      value: formData.otp,
      onChange: handleChange,
    },
    {
      id: "password",
      label: "New Password",
      placeholder: "••••••••",
      type: "password",
      required: true,
      value: formData.password,
      onChange: handleChange,
    },
  ];

  return (
    <DynamicCardForm
      title={UI_TEXT.title}
      description={<p className="text-sm text-neutral-600 dark:text-neutral-300">{UI_TEXT.description}</p>}
      fields={formFields}
      actionButton={{
        text: isLoading ? "Updating..." : UI_TEXT.submitLabel,
        variant: "default",
        size: "default",
      }}
      extraHeaderAction={
        <ButtonWithIcon
          text="Reset with Key"
          size="sm"
          variant="outline"
          icon={<Key size={16} />}
          onClick={handleSubmit}
        />
      }
      footerButtons={[
        {
          text: UI_TEXT.backLabel,
          variant: "link",
          size: "sm",
          type: "button",
          onClick: goToLogin,
        },
      ]}
    />
  );
}
