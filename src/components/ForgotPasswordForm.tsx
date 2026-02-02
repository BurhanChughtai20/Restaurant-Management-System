"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthNavigation } from "@/auth";
import { useForgotPasswordMutation } from "@/app/store/api/authApi";
import { useAlert } from "./DynamicAlert";
import { Mail } from "lucide-react";
import { DynamicCardForm } from "./FormInput";
import { FormField } from "@/app/store/api";
import { ButtonWithIcon } from "./Button";
import DynamicContent from "./Title";

export function ForgotPasswordForm() {
  const { goToLogin } = useAuthNavigation();
  const { showAlert } = useAlert();
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = useCallback(async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      showAlert("Valid email is required", "error");
      return;
    }

    try {
      await forgotPassword({ email }).unwrap();
      showAlert("Password reset link sent to your email!", "success");
      router.push("/reset-password");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      showAlert(error?.data?.message ?? "Failed to send reset link. Please try again.", "error");
    }
  }, [email, forgotPassword, showAlert, router]);
  
const formFields: FormField[] = [
  {
    id: "email",
    label: "Recovery Email",
    type: "email",
    placeholder: "you@example.com",
    required: true,
    value: email,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setEmail(e.target.value),
  },
];


  return (
    <DynamicCardForm
      title="Forgot Password?"
      description={
        <DynamicContent as="h6" className="text-sm text-neutral-600 dark:text-neutral-300">
          No worries! Enter your email and we will send you a reset link.
        </DynamicContent>
      }
      fields={formFields}
      actionButton={{
        text: isLoading ? "Sending..." : "Send Reset Link",
        variant: "default",
        size: "default",
        onClick: handleSubmit,
      }}
      footerButtons={[
        {
          text: "Back to Login",
          variant: "link",
          size: "sm",
          type: "button",
          onClick: goToLogin,
        },
      ]}
      extraHeaderAction={
        <ButtonWithIcon
          text="Send with Email"
          size="sm"
          variant="outline"
          icon={<Mail size={16} />}
          onClick={handleSubmit}
        />
      }
    />
  );
}
