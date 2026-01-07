import BlogCard, { Article } from "./BlogCard";

interface BlogListProps {
  blogs: Article[];
}

export default function BlogList({ blogs }: BlogListProps) {
  return (
    <div className="grid grid-cols-3 gap-10">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
