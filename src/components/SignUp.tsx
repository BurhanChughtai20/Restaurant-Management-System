"use client";
import { LogIn } from "lucide-react";
import { useState } from "react";
import {  FormField, Role, SignupRequest } from "@/app/store/api";
import { useSignupAdminMutation } from "@/app/store/api/authApi";
import { useAuthNavigation } from "@/auth";
import { useAlert } from "./DynamicAlert";
import { ButtonWithIcon } from "./Button";
import { DynamicCardForm } from "./FormInput";
import DynamicContent from "./Title";

export function SignupFormDemo() {
  const { goToLogin, goToVerifyEmail } = useAuthNavigation();
  const { showAlert } = useAlert();

  const [formData, setFormData] = useState<SignupRequest>({
    name: "",
    email: "",
    password: "",
    role: Role.Admin,
  });

  const [signupAdmin, { isLoading }] = useSignupAdminMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: id === "role" ? Role.Admin : value }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return showAlert("Name is required", "error");
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) return showAlert("Valid email required", "error");
    if (formData.password.length < 6) return showAlert("Password must be at least 6 characters", "error");

    try {
      await signupAdmin(formData).unwrap();
      localStorage.setItem("signupEmail", formData.email);
      localStorage.setItem("signupRole", formData.role);
      showAlert("Signup successful! OTP sent to email.", "success");
      goToVerifyEmail();
    } catch (err) {
      const error = err as { data?: { message?: string } };
      showAlert(error?.data?.message ?? "Signup failed. Please try again.", "error");
    }
  };

  const formFields: FormField[] = [
    { id: "name", label: "First Name", placeholder: "Tyler", type: "text", required: true, value: formData.name, onChange: handleChange },
    { id: "email", label: "Email Address", placeholder: "projectmayhem@fc.com", type: "email", required: true, value: formData.email, onChange: handleChange },
    { id: "password", label: "Password", placeholder: "••••••••", type: "password", required: true, value: formData.password, onChange: handleChange },
    { id: "role", label: "Role", type: "text", placeholder: "Admin", required: true, value: formData.role, onChange: handleChange },
  ];

  return (
    <DynamicCardForm
      title="Welcome to Aceternity"
      description={
        <DynamicContent as="h6" className="text-sm text-neutral-600 dark:text-neutral-300">
          Create an account to unlock full access to our AI tools.
        </DynamicContent>
      }
      fields={formFields}
      actionButton={{
        text: isLoading ? "Signing up..." : "Sign up →",
        variant: "default",
        size: "default",
        onClick: handleSubmit,
      }}
      footerButtons={[
        {
          text: "Already have an account? Login",
          variant: "link",
          size: "sm",
          type: "button",
          onClick: goToLogin,
        },
      ]}
      extraHeaderAction={
        <ButtonWithIcon
          text="Sign up with LogIn"
          size="sm"
          variant="outline"
          icon={<LogIn size={16} />}
          onClick={handleSubmit}
        />
      }
    />
  );
}
