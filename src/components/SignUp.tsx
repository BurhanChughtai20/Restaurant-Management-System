"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import DynamicContent from "./Title";
import FormInput from "./FormInput";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import { useAuthNavigation } from "@/auth";

 const FORM_FIELDS = [
  { id: "firstname", label: "First name", placeholder: "Tyler", type: "text", halfWidth: true },
  { id: "lastname", label: "Last name", placeholder: "Durden", type: "text", halfWidth: true },
  { id: "email", label: "Email Address", placeholder: "projectmayhem@fc.com", type: "email" },
  { id: "password", label: "Password", placeholder: "••••••••", type: "password" },
];

const SOCIAL_PLATFORMS = [
  { label: "GitHub", icon: <IconBrandGithub className="h-4 w-4" /> },
  { label: "Google", icon: <IconBrandGoogle className="h-4 w-4" /> },
  { label: "Fans", icon: <IconBrandOnlyfans className="h-4 w-4" /> },
];
 
const classes = {
  wrapper: "mx-auto w-[95%] sm:w-[90%] md:max-w-md lg:max-w-lg xl:max-w-xl shadow-input rounded-2xl bg-white p-6 md:p-8 dark:bg-black border border-neutral-100 dark:border-neutral-800",
  title: "text-neutral-800 dark:text-neutral-200 text-center md:text-left",
  description: "mt-2 max-w-sm text-neutral-600 dark:text-neutral-300 text-center md:text-left text-xs md:text-sm",
  form: "my-8",
  nameRow: "flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4",
  fieldSpacing: "mb-4 md:mb-6",
  submitBtn: "group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-input dark:bg-zinc-800",
  divider: "my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700",
  socialGroup: "grid grid-cols-1 sm:grid-cols-3 gap-4",
  socialBtn: "group/btn shadow-input relative flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 text-black dark:bg-zinc-900 dark:text-white",
  footerContainer: "mt-6 text-center",
};

export function SignupFormDemo() {
  const { goToLogin } = useAuthNavigation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  const nameRowFields = FORM_FIELDS.filter(f => f.halfWidth);
  const fullWidthFields = FORM_FIELDS.filter(f => !f.halfWidth);

  return (
    <div className={classes.wrapper}>
      <DynamicContent as="h2" className={classes.title}>
        Welcome to Aceternity
      </DynamicContent>
      <DynamicContent as="p" className={classes.description}>
        Create an account to unlock full access to our AI tools.
      </DynamicContent>

      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes.nameRow}>
          {nameRowFields.map((field) => (
            <FormInput key={field.id} {...field} />
          ))}
        </div>

        {fullWidthFields.map((field) => (
          <FormInput 
            key={field.id} 
            {...field} 
            containerClassName={classes.fieldSpacing} 
          />
        ))}

        <button className={classes.submitBtn} type="submit">
          Sign up &rarr;
          <BottomGradient />
        </button>

        <div className={classes.divider} />

        <div className={classes.socialGroup}>
          {SOCIAL_PLATFORMS.map((platform) => (
            <SocialButton 
              key={platform.label} 
              icon={platform.icon} 
              label={platform.label} 
            />
          ))}
        </div>
      </form>

      {/* --- INSERTED LOGIN LINK SECTION --- */}
      <div className={classes.footerContainer}>
      <DynamicContent as="span" className="text-neutral-600 dark:text-neutral-400">
          Already have an account?{" "}
          <button onClick={goToLogin} className="text-black dark:text-white font-bold hover:underline">
            Login
          </button>
        </DynamicContent>
      </div>
    </div>
  );
}

// --- Helper Components ---
const SocialButton = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button className={classes.socialBtn} type="button">
    {icon}
    <span className="text-sm font-medium">{label}</span>
    <BottomGradient />
  </button>
);

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-linear-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);