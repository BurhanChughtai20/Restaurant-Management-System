import { Metadata } from "next";
import articles from "@/data/articles.json";
import { Article } from "@/components/BlogCard";
import BlogGridWrapper from "@/components/BlogGridWrapper";
import { BlogHero } from "@/components/BlogHero";
import DynamicContent from "@/components/Title";

// 1. Standard Next.js Metadata (Keep this separate)
export const metadata: Metadata = {
  title: "All Blogs | Food Blogs",
  description: "Explore our latest food articles and recipes.", // Good for SEO
};

// 2. Custom page constants
const PAGE_CONFIG = {
  miniTitle: "Blogs",
  title: "Take a look at the latest articles from Luvy",
};

export default function BlogPage() {
  // Filter published blogs
  const blogs = (articles as Article[]).filter(b => b.isPublished);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10"> 
      <div className="space-y-12">
        <BlogHero />

           <div className="flex flex-col items-center justify-center gap-y-4">
        <DynamicContent 
          as="p" 
          className="text-xs font-semibold bg-black text-white px-3 py-1 rounded-full uppercase tracking-widest"
        >
          {PAGE_CONFIG.miniTitle}
        </DynamicContent>


          <DynamicContent as="h2"  className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight max-w-xl text-center">
                {PAGE_CONFIG.title}
              </DynamicContent>
      </div>


        <BlogGridWrapper blogs={blogs} />
      </div>
    </div>
  );
}