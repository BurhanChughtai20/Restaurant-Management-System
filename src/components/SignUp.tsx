"use client";

import React, { useState, useCallback } from "react";
import DynamicContent from "./Title";
import FormInput from "./FormInput";
import { useAuthNavigation } from "@/auth";
import { Role, SignupRequest } from "@/app/store/api";
import { useSignupAdminMutation } from "@/app/store/api/authApi";
import { useAlert } from "./DynamicAlert";

// --- Form fields ---
const FORM_FIELDS = [
  { id: "name", label: "First name", placeholder: "Tyler", type: "text", halfWidth: true },
  { id: "email", label: "Email Address", placeholder: "projectmayhem@fc.com", type: "email" },
  { id: "password", label: "Password", placeholder: "••••••••", type: "password" },
];

// --- Social platforms ---
const SOCIAL_PLATFORMS = [
  { label: "GitHub" },
  { label: "Google" },
  { label: "Fans" },
];

// --- Tailwind classes object ---
const styles = {
  container: "mx-auto w-[95%] sm:w-[90%] md:max-w-md lg:max-w-lg xl:max-w-xl shadow-input rounded-2xl bg-white p-6 md:p-8 dark:bg-black border border-neutral-100 dark:border-neutral-800",
  title: "text-neutral-800 dark:text-neutral-200 text-center md:text-left",
  subtitle: "mt-2 max-w-sm text-neutral-600 dark:text-neutral-300 text-center md:text-left text-xs md:text-sm",
  form: "my-8",
  row: "flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4",
  fullWidthField: "mb-4 md:mb-6",
  submitBtn: "group/btn relative block h-10 w-full rounded-md bg-linear-to-br from-black to-neutral-600 font-medium text-white shadow-input dark:bg-zinc-800",
  successMsg: "mt-2 text-green-600",
  errorMsg: "mt-2 text-red-600",
  divider: "my-8 h-px w-full bg-linear-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700",
  socialGrid: "grid grid-cols-1 sm:grid-cols-3 gap-4",
  socialBtn: "group/btn shadow-input relative flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 text-black dark:bg-zinc-900 dark:text-white",
  loginText: "mt-6 text-center",
  loginBtn: "text-black dark:text-white font-bold hover:underline",
};

export function SignupFormDemo() {
  const { goToLogin, goToVerifyEmail } = useAuthNavigation();

  // --- Form state dynamically generated from fields ---
  const initialState:  Omit<SignupRequest, "role"> = FORM_FIELDS.reduce((acc, f) => ({ ...acc, [f.id]: "" }), {}) as Omit<SignupRequest, "role"> ;
  const [formData, setFormData] = useState<Omit<SignupRequest, "role">>(initialState);
  const { showAlert } = useAlert();

  // --- RTK Query mutation ---
  const [signupAdmin, { isLoading, isSuccess, error }] = useSignupAdminMutation();

  // --- Handle input change ---
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }, []);

  // --- Handle form submit ---
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const payload: SignupRequest = {
        ...formData,
        role: Role.Admin,
      };

      try {
        await signupAdmin(payload).unwrap();
        goToVerifyEmail();
        showAlert("Signup successful! OTP sent to email.", "success");
        
      } catch (err) {
        console.error("Signup failed", err);
        showAlert("Signup failed. Please try again.", "error");
        
      }
    },
    [formData, signupAdmin, showAlert, goToVerifyEmail]
  );

  const nameRowFields = FORM_FIELDS.filter((f) => f.halfWidth);
  const fullWidthFields = FORM_FIELDS.filter((f) => !f.halfWidth);

  return (
    <div className={styles.container}>
      <DynamicContent as="h2" className={styles.title}>
        Welcome to Aceternity
      </DynamicContent>
      <DynamicContent as="p" className={styles.subtitle}>
        Create an account to unlock full access to our AI tools.
      </DynamicContent>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          {nameRowFields.map((field) => (
            <FormInput
              key={field.id}
              {...field}
              value={formData[field.id as keyof Omit<SignupRequest, "role">] }
              onChange={handleChange}
            />
          ))}
        </div>

        {fullWidthFields.map((field) => (
          <FormInput
            key={field.id}
            {...field}
            value={formData[field.id as keyof Omit<SignupRequest, "role">] }
            onChange={handleChange}
            containerClassName={styles.fullWidthField}
          />
        ))}

        <button type="submit" disabled={isLoading} className={styles.submitBtn}>
          {isLoading ? "Signing up..." : "Sign up →"}
        </button>

        {isSuccess && <p className={styles.successMsg}>Signup successful!</p>}
        {error && <p className={styles.errorMsg}>Signup failed. Please try again.</p>}

        <div className={styles.divider} />

        <div className={styles.socialGrid}>
          {SOCIAL_PLATFORMS.map((platform) => (
            <button key={platform.label} type="button" className={styles.socialBtn}>
              <span className="text-sm font-medium">{platform.label}</span>
            </button>
          ))}
        </div>
      </form>

      <div className={styles.loginText}>
        <DynamicContent as="span" className="text-neutral-600 dark:text-neutral-400">
          Already have an account?{" "}
          <button onClick={goToLogin} className={styles.loginBtn}>
            Login
          </button>
        </DynamicContent>
      </div>
    </div>
  );
}
