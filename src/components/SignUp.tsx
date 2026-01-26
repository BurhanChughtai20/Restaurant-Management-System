"use client";

import React, { useState, useCallback } from "react";
import DynamicContent from "./Title";
import FormInput from "./FormInput";
import { useAuthNavigation } from "@/auth";
import { Role, SignupRequest } from "@/app/store/api";
import { useSignupAdminMutation } from "@/app/store/api/authApi";
import { useAlert } from "./DynamicAlert";
import ButtonCom from "./Button";
import { LogIn } from "lucide-react";

type FormField = {
  id: "name" | "email" | "password" | "role";
  label: string;
  placeholder?: string;
  type?: string;
  halfWidth?: boolean;
  options?: string[]; // for select fields
};

// Only one role option: Admin
const FORM_FIELDS: readonly FormField[] = [
  { id: "name", label: "First name", placeholder: "Tyler", type: "text", halfWidth: true },
  { id: "email", label: "Email Address", placeholder: "projectmayhem@fc.com", type: "email" },
  { id: "password", label: "Password", placeholder: "••••••••", type: "password" },
  { id: "role", label: "Role", options: ["Admin"] },
];

const styles = {
  container: "mx-auto w-[95%] sm:w-[90%] md:max-w-md lg:max-w-lg xl:max-w-xl shadow-input rounded-2xl bg-white p-6 md:p-8 dark:bg-black border border-neutral-100 dark:border-neutral-800",
  title: "text-neutral-800 dark:text-neutral-200 text-center md:text-left",
  subtitle: "mt-2 max-w-sm text-neutral-600 dark:text-neutral-300 text-center md:text-left text-xs md:text-sm",
  form: "my-8",
  row: "flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4",
  fullWidthField: "mb-4 md:mb-6",
  submitBtn: "group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-input dark:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity",
  loginText: "mt-6 text-center",
  loginBtn: "text-black dark:text-white font-bold hover:underline",
};

export function SignupFormDemo() {
  const { goToLogin, goToVerifyEmail } = useAuthNavigation();
  const { showAlert } = useAlert();

  // Set default role as "Admin" to match SignupRequest type
  const [formData, setFormData] = useState<SignupRequest>({
    name: "",
    email: "",
    password: "",
    role: Role.Admin, // TypeScript requires exact Role.Admin
  });

  const [signupAdmin, { isLoading }] = useSignupAdminMutation();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { id, value } = e.target;

      // For role, always assign Role.Admin to satisfy TS
      if (id === "role") {
        setFormData((prev) => ({ ...prev, role: Role.Admin }));
      } else {
        setFormData((prev) => ({ ...prev, [id]: value }));
      }
    },
    []
  );

  const validateForm = useCallback(() => {
    if (!formData.name.trim()) {
      showAlert("Name is required", "error");
      return false;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
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
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validateForm()) return;

      try {
        await signupAdmin(formData).unwrap();

        // Store email and role for verification step
        localStorage.setItem("signupEmail", formData.email);
        localStorage.setItem("signupRole", formData.role);

        showAlert("Signup successful! OTP sent to email.", "success");
        goToVerifyEmail();
      } catch (err: unknown) {
        const errorMessage =
          err && typeof err === "object" && "data" in err
            ? (err as { data?: { message?: string } }).data?.message || "Signup failed"
            : "Signup failed. Please try again.";
        showAlert(errorMessage, "error");
      }
    },
    [formData, signupAdmin, showAlert, goToVerifyEmail, validateForm]
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
              value={formData[field.id as keyof typeof formData]}
              onChange={handleChange}
            />
          ))}
        </div>

        {fullWidthFields.map((field) =>
          field.options ? (
            <div key={field.id} className={styles.fullWidthField}>
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
              >
                {field.label}
              </label>
              <select
                id={field.id}
                value={formData.role} // always Admin
                onChange={handleChange}
                className="block w-full rounded-md border border-neutral-300 dark:border-neutral-700 p-2 dark:bg-black dark:text-white"
              >
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <FormInput
              key={field.id}
              {...field}
              value={formData[field.id as keyof typeof formData]}
              onChange={handleChange}
              containerClassName={styles.fullWidthField}
            />
          )
        )}

        <ButtonCom
          text={isLoading ? "Signing up..." : "Sign up →"}
          type="default"
          htmlType="submit"
          gradient
          icon={<LogIn size={18} />}
          iconPosition="right"
          className="w-full"
          disabled={isLoading}
        />
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
