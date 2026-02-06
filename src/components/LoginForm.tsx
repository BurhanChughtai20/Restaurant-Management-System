"use client";

import { LogIn } from "lucide-react";
import { useState, useCallback } from "react";
import { useAppDispatch } from "@/app/store/hooks";
import { setCredentials } from "@/app/store/slices/authSlice";
import { useAuthNavigation } from "@/auth";
import { useLoginMutation } from "@/app/store/api/authApi";
import { useAlert } from "./DynamicAlert";
import { ButtonWithIcon } from "./Button";
import { FormField, LoginRequest, Role } from "@/app/store/api/types";
import { DynamicCardForm } from "./FormInput";
import DynamicContent from "./Title";

export function LoginForm() {
  const dispatch = useAppDispatch();
  const { goToSignup, goToForgotPassword, goToDashboard } = useAuthNavigation();
  const { showAlert } = useAlert();

  const [formData, setFormData] = useState<LoginRequest>({ email: "", password: "" });
  const [login, { isLoading }] = useLoginMutation();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { id, value } = e.target;
      setFormData((prev) => ({ ...prev, [id]: value }));
    },
    []
  );

  const validateForm = useCallback(() => {
    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !/\S+@\S+\.\S+$/.test(email)) {
      showAlert("Valid email is required", "error");
      return false;
    }
    if (password.length < 3) {
      showAlert("Password must be at least 3 characters", "error");
      return false;
    }
    return true;
  }, [formData, showAlert]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    try {
      const response = await login({
        email: formData.email.trim(),
        password: formData.password,
        role: Role.Admin,
      }).unwrap();
      dispatch(setCredentials({ user: response.user, token: response.token }));
      showAlert("Login successful!", "success");
      goToDashboard();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      showAlert(error?.data?.message ?? "Login failed. Please check your credentials.", "error");
    }
  }, [formData, login, dispatch, showAlert, goToDashboard, validateForm]);

  // Form fields
  const loginFields: FormField[] = [
    {
      id: "email",
      label: "Email Address",
      type: "email",
      placeholder: "projectmayhem@fc.com",
      required: true,
      value: formData.email,
      onChange: handleChange,
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      placeholder: "••••••••",
      required: true,
      value: formData.password,
      onChange: handleChange,
    },
  ];

  return (
    <DynamicCardForm
      title="Welcome Back"
      description={
        <DynamicContent as="p" className="text-sm text-neutral-600 dark:text-neutral-300 mb-6">
          Enter your credentials to access your account.
        </DynamicContent>
      }
      fields={loginFields}
      actionButton={{
        text: isLoading ? "Logging in..." : "Login →",
        variant: "default",
        size: "default",
        onClick: handleSubmit,
        fullWidth: true,
        className: "mt-4",
      }}
      footerButtons={[
        {
          text: "Forgot password?",
          variant: "link",
          size: "sm",
          type: "button",
          onClick: goToForgotPassword,
        },
        {
          text: "Don't have an account? Sign up",
          variant: "link",
          size: "sm",
          type: "button",
          onClick: goToSignup,
        },
      ]}
      extraHeaderAction={
        <div className="flex justify-center mt-6">
          <ButtonWithIcon
            text="Sign up with LogIn"
            size="sm"
            variant="outline"
            icon={<LogIn size={16} />}
            onClick={handleSubmit}
            className="w-full max-w-xs"
          />
        </div>
      }
    />
  );
}
