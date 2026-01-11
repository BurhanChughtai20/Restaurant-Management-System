// --- Dynamic Tailwind Classes ---
const classes = {
  container: "flex items-center justify-center min-h-screen",
  spinner: "w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin",
};

export default function Loading() {
  return (
    <div className={classes.container}>
      <div className={classes.spinner} />
    </div>
  );
}
