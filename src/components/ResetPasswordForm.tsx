"use client";
import React from "react";
import DynamicContent from "./Title";
import FormInput from "./FormInput";
import { useAuthNavigation } from "@/auth";

// --- Configuration Data (Static) ---
const UI_TEXT = {
  title: "Reset your password",
  description: "Strong passwords include numbers, letters, and symbols.",
  submitLabel: "Update Password",
  backLabel: "Back to Login"
};

const RESET_FIELDS = [
  { id: "password", label: "New Password", placeholder: "••••••••", type: "password" },
  { id: "confirmPassword", label: "Confirm New Password", placeholder: "••••••••", type: "password" },
];

const CLASSES = {
  wrapper: "mx-auto w-[95%] md:max-w-md shadow-input rounded-2xl bg-white p-6 md:p-8 dark:bg-black border border-neutral-100 dark:border-neutral-800",
  form: "my-8",
  inputSpacing: "mb-4",
  submitBtn: "w-full text-white rounded-md h-10 font-medium bg-black dark:bg-zinc-800 shadow-input hover:-translate-y-0.5 transition duration-200",
  backBtn: "flex items-center justify-center gap-2 hover:opacity-80 transition-opacity cursor-pointer",
  backText: "text-xs text-black dark:text-white font-bold"
};

// --- Component ---
export function ResetPasswordForm() {
  const { goToLogin } = useAuthNavigation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Password reset submitted");
  };

  return (
    <div className={CLASSES.wrapper}>
      <DynamicContent as="h3">{UI_TEXT.title}</DynamicContent>
      <DynamicContent as="p" className="mt-2 text-xs">{UI_TEXT.description}</DynamicContent>

      <form className={CLASSES.form} onSubmit={handleSubmit}>
        {RESET_FIELDS.map((field) => (
          <FormInput key={field.id} {...field} containerClassName={CLASSES.inputSpacing} />
        ))}

        <button className={CLASSES.submitBtn} type="submit">
          {UI_TEXT.submitLabel}
        </button>
      </form>

      <button onClick={goToLogin} className={CLASSES.backBtn}>
        <DynamicContent as="span" className={CLASSES.backText}>
          &larr; {UI_TEXT.backLabel}
        </DynamicContent>
      </button>
    </div>
  );
}
