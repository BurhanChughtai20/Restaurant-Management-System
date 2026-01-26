import { Metadata } from "next";
import dynamic from "next/dynamic";
import { generatePageMetadata } from '@/lib/metadata';

const SignupFormDemo = dynamic(() => import('@/components/SignUp').then(mod => mod.SignupFormDemo), {
  loading: () => (
    <div className="min-h-150 flex items-center justify-center">
       <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 w-full max-w-md h-125 rounded-2xl" />
    </div>
  ),
  ssr: true,
});

const classes = {
  container: "min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-dot-black/[0.1] dark:bg-dot-white/[0.1]",
};

export const metadata: Metadata = generatePageMetadata({
  title: "Create an Account",
  description: "Join Aceternity today. Sign up to access our powerful AI tools and streamline your workflow.",
  path: "/signup",
});
export const revalidate = 3600;

const SignupPage = () => {
  return (
    <main className={classes.container}>
      <SignupFormDemo />
    </main>
  );
};

export default SignupPage;