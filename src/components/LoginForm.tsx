"use client";

import React, { useState, useCallback } from "react";
import DynamicContent from "./Title";
import FormInput from "./FormInput";
import { useAuthNavigation } from "@/auth";
import { useLoginMutation } from "@/app/store/api/authApi";
import { useAppDispatch } from "@/app/store/hooks";
import { setCredentials } from "@/app/store/slices/authSlice";
import { useAlert } from "./DynamicAlert";
import { LoginRequest } from "@/app/store/api/types";
import ButtonCom from "./Button";

const LOGIN_FIELDS = [
  {
    id: "email",
    label: "Email Address",
    placeholder: "projectmayhem@fc.com",
    type: "email",
  },
  {
    id: "password",
    label: "Password",
    placeholder: "••••••••",
    type: "password",
  },
] as const;

const CLASSES = {
  wrapper:
    "mx-auto w-[95%] md:max-w-md shadow-input rounded-2xl bg-white p-6 md:p-8 dark:bg-black border border-neutral-100 dark:border-neutral-800",
  form: "my-8",
  inputSpacing: "mb-4",
  forgotWrapper: "flex justify-end mb-4",
  forgotText:
    "text-xs hover:text-black dark:hover:text-white transition-colors cursor-pointer",
  submitBtn:
    "relative group/btn w-full text-white rounded-md h-10 font-medium bg-black dark:bg-zinc-800 shadow-input disabled:opacity-50 disabled:cursor-not-allowed transition-opacity",
  bottomTextWrapper: "text-center",
  signupLink: "font-bold text-black dark:text-white hover:underline",
};

export function LoginForm() {
  const dispatch = useAppDispatch();
  const { goToSignup, goToForgotPassword, goToDashboard } = useAuthNavigation();
  const { showAlert } = useAlert();

  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const [login, { isLoading }] = useLoginMutation();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }, []);

  const validateForm = useCallback(() => {
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      showAlert("Valid email is required", "error");
      return false;
    }
    if (formData.password.length < 6) {
      showAlert("Password must be at least 6 characters", "error");
      return false;
    }
    return true;
  }, [formData, showAlert]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      try {
        const response = await login(formData).unwrap();

        // Dispatch credentials to Redux store
        dispatch(
          setCredentials({
            user: response.user,
            token: response.token,
          }),
        );

        showAlert("Login successful!", "success");
        goToDashboard();
      } catch (err: unknown) {
        const errorMessage =
          err && typeof err === "object" && "data" in err
            ? (err as { data?: { message?: string } }).data?.message ||
              "Login failed"
            : "Login failed. Please check your credentials.";

        showAlert(errorMessage, "error");
      }
    },
    [formData, login, dispatch, showAlert, goToDashboard, validateForm],
  );

  return (
    <div className={CLASSES.wrapper}>
      <DynamicContent as="h2">Welcome Back</DynamicContent>
      <DynamicContent as="p" className="mt-2">
        Enter your credentials to access your account.
      </DynamicContent>

      <form className={CLASSES.form} onSubmit={handleSubmit}>
        {LOGIN_FIELDS.map((field) => (
          <FormInput
            key={field.id}
            {...field}
            value={formData[field.id as keyof LoginRequest]}
            onChange={handleChange}
            containerClassName={CLASSES.inputSpacing}
          />
        ))}

        <div className={CLASSES.forgotWrapper}>
          <button
            type="button"
            onClick={goToForgotPassword}
            className={CLASSES.forgotText}
          >
            Forgot password?
          </button>
        </div>
        <ButtonCom
          text={isLoading ? "Logging in..." : "Login →"}
          type="default"
          gradient={true}
          icon={<BottomGradient />}
          iconPosition="right"
          onClick={handleSubmit}
          className={CLASSES.submitBtn}
          disabled={isLoading}
        />
      </form>

      <div className={CLASSES.bottomTextWrapper}>
        <DynamicContent as="span">
          Don&apos;t have an account?{" "}
          <button onClick={goToSignup} className={CLASSES.signupLink}>
            Sign up
          </button>
        </DynamicContent>
      </div>
    </div>
  );
}

const BottomGradient = () => (
  <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
);
