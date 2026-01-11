import BlogCard, { Article } from "./BlogCard";

// --- Dynamic Tailwind Classes ---
const classes = {
  grid: "grid grid-cols-3 gap-10",
};

interface BlogListProps {
  blogs: Article[];
}

export default function BlogList({ blogs }: BlogListProps) {
  return (
    <div className={classes.grid}>
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
