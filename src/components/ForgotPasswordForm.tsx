"use client";
import React from "react";
import DynamicContent from "./Title";
import FormInput from "./FormInput";
import { useAuthNavigation } from "@/auth";

// --- Configuration Data (Static) ---
const UI_TEXT = {
  title: "Forgot Password?",
  description: "No worries! Enter your email and we will send you a reset link.",
  submitLabel: "Send Reset Link",
  backLabel: "Back to Login"
};

const FORGOT_FIELDS = [
  { id: "email", label: "Recovery Email", placeholder: "you@example.com", type: "email" },
];

const CLASSES = {
  wrapper: "mx-auto w-[95%] md:max-w-md shadow-input rounded-2xl bg-white p-6 md:p-8 dark:bg-black border border-neutral-100 dark:border-neutral-800",
  form: "my-8",
  inputSpacing: "mb-6",
  submitBtn: "relative group/btn w-full text-white rounded-md h-10 font-medium bg-black dark:bg-zinc-800",
  backLink: "flex items-center justify-center gap-2 hover:opacity-80 transition-opacity cursor-pointer",
  backText: "text-xs"
};

// --- Component ---
export function ForgotPasswordForm() {
  const { goToLogin } = useAuthNavigation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Forgot password submitted");
  };

  return (
    <div className={CLASSES.wrapper}>
      <DynamicContent as="h2">{UI_TEXT.title}</DynamicContent>
      <DynamicContent as="p" className="mt-2">{UI_TEXT.description}</DynamicContent>

      <form className={CLASSES.form} onSubmit={handleSubmit}>
        {FORGOT_FIELDS.map((field) => (
          <FormInput key={field.id} {...field} containerClassName={CLASSES.inputSpacing} />
        ))}

        <button className={CLASSES.submitBtn} type="submit">
          {UI_TEXT.submitLabel}
        </button>
      </form>

      <button onClick={goToLogin} className={CLASSES.backLink}>
        <DynamicContent as="span" className={CLASSES.backText}>
          &larr; {UI_TEXT.backLabel}
        </DynamicContent>
      </button>
    </div>
  );
}
