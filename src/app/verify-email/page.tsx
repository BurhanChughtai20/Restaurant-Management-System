import { Metadata } from "next";
import dynamic from "next/dynamic";
import { generatePageMetadata } from '@/lib/metadata';

const EmailVerifyForm = dynamic(() => import('@/components/EmailVerifyForm').then(mod => mod.EmailVerifyForm), {
  loading: () => (
    <div className="min-h-[400px] flex items-center justify-center">
       <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 w-full max-w-md h-[350px] rounded-2xl" />
    </div>
  ),
  ssr: true,
});

export const metadata: Metadata = generatePageMetadata({
  title: "Verify Email",
  description: "Confirm your email address to secure your account.",
  path: "/verify-email",
});

export default function VerifyPage() {
  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4 bg-dot-black/[0.1] dark:bg-dot-white/[0.1]">
      <EmailVerifyForm />
    </main>
  );
}