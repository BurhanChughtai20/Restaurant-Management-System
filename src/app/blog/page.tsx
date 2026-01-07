import { Metadata } from "next";
import articles from "@/data/articles.json";
import { Article } from "@/components/BlogCard";
import BlogGridWrapper from "@/components/BlogGridWrapper";

export const metadata: Metadata = {
  title: "All Blogs | Food Blogs",
  description: "Browse all published restaurant blogs.",
};

export default function BlogPage() {
  const blogs = (articles as Article[]).filter(b => b.isPublished);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-10 text-center">All Articles</h1>
      <BlogGridWrapper blogs={blogs} />
    </div>
  );
}