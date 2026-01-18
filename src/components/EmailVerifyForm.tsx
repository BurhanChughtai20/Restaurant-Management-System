"use client";

import React from "react";
import DynamicContent from "./Title";
import FormInput from "./FormInput";
import { useAuthNavigation } from "@/auth";

// --- Configuration Data (Static) ---
const VERIFY_FIELDS = [
  { id: "email", label: "Email Address", placeholder: "tyler@durden.com", type: "email" },
  { id: "otp", label: "Verification Code", placeholder: "123456", type: "text" },
];

const UI_TEXT = {
  title: "Verify your email",
  description: "We've sent a 6-digit code to your email. Please enter it below to activate your account.",
  submitLabel: "Verify Account",
  resendText: "Didn't receive a code?",
  resendLink: "Resend Code",
};

const CLASSES = {
  wrapper: "mx-auto w-[95%] sm:w-[90%] md:max-w-md shadow-input rounded-2xl bg-white p-6 md:p-8 dark:bg-black border border-neutral-100 dark:border-neutral-800",
  title: "text-neutral-800 dark:text-neutral-200 text-center",
  description: "mt-2 text-neutral-600 dark:text-neutral-300 text-center text-xs md:text-sm",
  form: "my-8",
  fieldSpacing: "mb-4",
  submitBtn: "group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-input dark:bg-zinc-800",
  footerContainer: "mt-6 text-center",
  resendAction: "text-black dark:text-white font-bold hover:underline cursor-pointer ml-1",
};

// --- Component ---
export function EmailVerifyForm() {
  const { goToLogin } = useAuthNavigation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Verifying OTP...");
  };

  return (
    <div className={CLASSES.wrapper}>
      <DynamicContent as="h2" className={CLASSES.title}>
        {UI_TEXT.title}
      </DynamicContent>
      <DynamicContent as="p" className={CLASSES.description}>
        {UI_TEXT.description}
      </DynamicContent>

      <form className={CLASSES.form} onSubmit={handleSubmit}>
        {VERIFY_FIELDS.map((field) => (
          <FormInput
            key={field.id}
            {...field}
            containerClassName={CLASSES.fieldSpacing}
          />
        ))}

        <button className={CLASSES.submitBtn} type="submit">
          {UI_TEXT.submitLabel} &rarr;
          <BottomGradient />
        </button>
      </form>

      <div className={CLASSES.footerContainer}>
        <DynamicContent as="span" className="text-neutral-600 dark:text-neutral-400">
          {UI_TEXT.resendText}
          <button onClick={goToLogin} className={CLASSES.resendAction}>
            {UI_TEXT.resendLink}
          </button>
        </DynamicContent>
      </div>
    </div>
  );
}

// --- Bottom Gradient Component ---
const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);
