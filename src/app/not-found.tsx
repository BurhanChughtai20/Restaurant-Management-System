import Link from "next/link";

// --- Dynamic Tailwind Classes ---
const classes = {
  container: "flex flex-col items-center justify-center min-h-screen px-4",
  title: "text-4xl font-bold text-gray-900 mb-4",
  message: "text-gray-600 mb-8 text-center max-w-md",
  link: "bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors",
};

export default function NotFound() {
  return (
    <div className={classes.container}>
      <h2 className={classes.title}>404</h2>
      <p className={classes.message}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className={classes.link}>
        Return Home
      </Link>
    </div>
  );
}
