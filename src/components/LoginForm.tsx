"use client";
import React from "react";
import DynamicContent from "./Title";
import FormInput from "./FormInput";
import { useAuthNavigation } from "@/auth";

// --- Configuration Data (Static) ---
const LOGIN_FIELDS = [
  { id: "email", label: "Email Address", placeholder: "projectmayhem@fc.com", type: "email" },
  { id: "password", label: "Password", placeholder: "••••••••", type: "password" },
];

const CLASSES = {
  wrapper: "mx-auto w-[95%] md:max-w-md shadow-input rounded-2xl bg-white p-6 md:p-8 dark:bg-black border border-neutral-100 dark:border-neutral-800",
  form: "my-8",
  inputSpacing: "mb-4",
  forgotWrapper: "flex justify-end mb-4",
  forgotText: "text-xs hover:text-black dark:hover:text-white transition-colors cursor-pointer",
  submitBtn: "relative group/btn w-full text-white rounded-md h-10 font-medium bg-black dark:bg-zinc-800 shadow-input",
  bottomTextWrapper: "text-center",
  signupLink: "font-bold text-black dark:text-white"
};

// --- Component ---
export function LoginForm() {
  const { goToSignup, goToForgotPassword } = useAuthNavigation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login submitted");
  };

  return (
    <div className={CLASSES.wrapper}>
      <DynamicContent as="h2">Welcome Back</DynamicContent>
      <DynamicContent as="p" className="mt-2">Enter your credentials to access your account.</DynamicContent>

      <form className={CLASSES.form} onSubmit={handleSubmit}>
        {LOGIN_FIELDS.map((field) => (
          <FormInput key={field.id} {...field} containerClassName={CLASSES.inputSpacing} />
        ))}

        <div className={CLASSES.forgotWrapper}>
          <button type="button" onClick={goToForgotPassword} className={CLASSES.forgotText}>
            Forgot password?
          </button>
        </div>

        <button className={CLASSES.submitBtn} type="submit">
          Login &rarr;
          <BottomGradient />
        </button>
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

// --- Bottom Gradient Component ---
const BottomGradient = () => (
  <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
);
