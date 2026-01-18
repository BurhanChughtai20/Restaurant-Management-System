import { Metadata } from "next";
import dynamic from "next/dynamic";
import { generatePageMetadata } from '@/lib/metadata';

// Dynamic import for the Signup Form to improve initial page load speed
const SignupFormDemo = dynamic(() => import('@/components/SignUp').then(mod => mod.SignupFormDemo), {
  loading: () => (
    <div className="min-h-[600px] flex items-center justify-center">
       <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 w-full max-w-md h-[500px] rounded-2xl" />
    </div>
  ),
  ssr: true, // Form is rendered on server for SEO and better hydration
});

// --- Dynamic Tailwind Classes ---
const classes = {
  container: "min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-dot-black/[0.1] dark:bg-dot-white/[0.1]",
};

// SEO Metadata Generation
export const metadata: Metadata = generatePageMetadata({
  title: "Create an Account",
  description: "Join Aceternity today. Sign up to access our powerful AI tools and streamline your workflow.",
  path: "/signup",
});

// Enable static generation with revalidation (revalidate every hour)
// Note: Usually signup pages don't change often, so this is efficient.
export const revalidate = 3600;

const SignupPage = () => {
  return (
    <main className={classes.container}>
      {/* Using <main> tag for better semantic HTML (SEO best practice).
          The SignupFormDemo is loaded dynamically.
      */}
      <SignupFormDemo />
    </main>
  );
};

export default SignupPage;