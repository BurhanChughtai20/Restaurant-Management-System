import { Metadata } from "next";
import dynamic from "next/dynamic";
import { generatePageMetadata } from '@/lib/metadata';

const ResetPasswordForm = dynamic(() => import('@/components/ResetPasswordForm').then(mod => mod.ResetPasswordForm), {
  loading: () => (
    <div className="min-h-[450px] flex items-center justify-center">
       <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 w-full max-w-md h-[350px] rounded-2xl" />
    </div>
  ),
  ssr: true,
});

const classes = {
  container: "min-h-screen flex items-center justify-center py-12 px-4 bg-dot-black/[0.1] dark:bg-dot-white/[0.1]",
};

export const metadata: Metadata = generatePageMetadata({
  title: "Reset Password",
  description: "Securely update your password to regain access to your account.",
  path: "/reset-password",
});

export const revalidate = 3600;

const ResetPasswordPage = () => {
  return (
    <main className={classes.container}>
      <ResetPasswordForm />
    </main>
  );
};

export default ResetPasswordPage;