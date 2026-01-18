import { Metadata } from "next";
import dynamic from "next/dynamic";
import { generatePageMetadata } from '@/lib/metadata';

const ForgotPasswordForm = dynamic(() => import('@/components/ForgotPasswordForm').then(mod => mod.ForgotPasswordForm), {
  loading: () => (
    <div className="min-h-[400px] flex items-center justify-center">
       <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 w-full max-w-md h-[300px] rounded-2xl" />
    </div>
  ),
  ssr: true,
});

const classes = {
  container: "min-h-screen flex items-center justify-center py-12 px-4 bg-dot-black/[0.1] dark:bg-dot-white/[0.1]",
};

export const metadata: Metadata = generatePageMetadata({
  title: "Forgot Password",
  description: "Recover your account access by requesting a password reset link.",
  path: "/forgot-password",
});

export const revalidate = 3600;

const ForgotPasswordPage = () => {
  return (
    <main className={classes.container}>
      <ForgotPasswordForm />
    </main>
  );
};

export default ForgotPasswordPage;