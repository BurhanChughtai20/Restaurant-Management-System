"use client";

import React, { useState, useCallback } from "react";
import DynamicContent from "./Title";
import FormInput from "./FormInput";
import { useAuthNavigation } from "@/auth";
import { Role, SignupRequest } from "@/app/store/api";
import { useSignupAdminMutation } from "@/app/store/api/authApi";

const FORM_FIELDS = [
  { id: "firstname", label: "First name", placeholder: "Tyler", type: "text", halfWidth: true },
  { id: "lastname", label: "Last name", placeholder: "Durden", type: "text", halfWidth: true },
  { id: "email", label: "Email Address", placeholder: "projectmayhem@fc.com", type: "email" },
  { id: "password", label: "Password", placeholder: "••••••••", type: "password" },
  { id: "restaurantName", label: "Restaurant Name", placeholder: "Project Mayhem", type: "text" },
];

const SOCIAL_PLATFORMS = [
  { label: "GitHub" },
  { label: "Google" },
  { label: "Fans" },
];

type SignupFormState = {
  name: string;
  email: string;
  password: string;
  restaurantName: string;
};

const initialState: SignupFormState = {
  name: "",
  email: "",
  password: "",
  restaurantName: "",
};

export function SignupFormDemo() {
  const { goToLogin } = useAuthNavigation();

  // --- Form state dynamically generated from fields ---
  const initialState = FORM_FIELDS.reduce((acc, f) => ({ ...acc, [f.id]: "" }), {});
  const [formData, setFormData] = useState(initialState);

  // --- RTK Query mutation ---
  const [signupAdmin, { isLoading, isSuccess, error }] = useSignupAdminMutation();

  // --- Handle input change (DRY) ---
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }, []);

  // --- Handle form submit ---
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const payload: SignupRequest = {
        name: `${formData.name}`,
        email: formData.email,
        password: formData.password,
        restaurantName: formData.restaurantName,
        role: Role.Admin, // enforced by type
      };

      try {
        await signupAdmin(payload).unwrap();
        console.log("Signup successful!");
      } catch (err) {
        console.error("Signup failed", err);
      }
    },
    [formData, signupAdmin]
  );

  // --- Split fields for layout ---
  const nameRowFields = FORM_FIELDS.filter((f) => f.halfWidth);
  const fullWidthFields = FORM_FIELDS.filter((f) => !f.halfWidth);

  return (
    <div className="mx-auto w-[95%] sm:w-[90%] md:max-w-md lg:max-w-lg xl:max-w-xl shadow-input rounded-2xl bg-white p-6 md:p-8 dark:bg-black border border-neutral-100 dark:border-neutral-800">
      <DynamicContent as="h2" className="text-neutral-800 dark:text-neutral-200 text-center md:text-left">
        Welcome to Aceternity
      </DynamicContent>
      <DynamicContent as="p" className="mt-2 max-w-sm text-neutral-600 dark:text-neutral-300 text-center md:text-left text-xs md:text-sm">
        Create an account to unlock full access to our AI tools.
      </DynamicContent>

      <form onSubmit={handleSubmit} className="my-8">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
          {nameRowFields.map((field) => (
            <FormInput
              key={field.id}
              {...field}
              value={formData[field.id] as string}
              onChange={handleChange}
            />
          ))}
        </div>

        {fullWidthFields.map((field) => (
          <FormInput
            key={field.id}
            {...field}
            value={formData[field.id]}
            onChange={handleChange}
            containerClassName="mb-4 md:mb-6"
          />
        ))}

        <button
          type="submit"
          disabled={isLoading}
          className="group/btn relative block h-10 w-full rounded-md bg-linear-to-br from-black to-neutral-600 font-medium text-white shadow-input dark:bg-zinc-800"
        >
          {isLoading ? "Signing up..." : "Sign up →"}
        </button>

        {isSuccess && <p className="mt-2 text-green-600">Signup successful!</p>}
        {error && <p className="mt-2 text-red-600">Signup failed. Please try again.</p>}

        <div className="my-8 h-px w-full bg-linear-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SOCIAL_PLATFORMS.map((platform) => (
            <button
              key={platform.label}
              type="button"
              className="group/btn shadow-input relative flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 text-black dark:bg-zinc-900 dark:text-white"
            >
              <span className="text-sm font-medium">{platform.label}</span>
            </button>
          ))}
        </div>
      </form>

      <div className="mt-6 text-center">
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
