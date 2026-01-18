import { Metadata } from "next";
import dynamic from "next/dynamic";
import { generatePageMetadata } from '@/lib/metadata';

const LoginForm = dynamic(() => import('@/components/LoginForm').then(mod => mod.LoginForm), {
  loading: () => (
    <div className="min-h-[500px] flex items-center justify-center">
       <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 w-full max-w-md h-[400px] rounded-2xl" />
    </div>
  ),
  ssr: true,
});

const classes = {
  container: "min-h-screen flex items-center justify-center py-12 px-4 bg-dot-black/[0.1] dark:bg-dot-white/[0.1]",
};

export const metadata: Metadata = generatePageMetadata({
  title: "Login",
  description: "Access your account to manage your projects and AI tools.",
  path: "/login",
});

export const revalidate = 3600;

const LoginPage = () => {
  return (
    <main className={classes.container}>
      <LoginForm />
    </main>
  );
};

export default LoginPage;