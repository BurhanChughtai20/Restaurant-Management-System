import { Metadata } from "next";
import articles from "@/data/articles.json";
import { Article } from "@/components/BlogCard";
import BlogGridWrapper from "@/components/BlogGridWrapper";
import { BlogHero } from "@/components/BlogHero";
import DynamicContent from "@/components/Title";
import { generatePageMetadata } from '@/lib/metadata'

// --- Dynamic Tailwind Classes ---
const classes = {
  container: "max-w-7xl mx-auto px-4 py-10",
  contentWrapper: "space-y-12",
  headerContainer: "flex flex-col items-center justify-center gap-y-4",
  miniTitle: "text-xs font-semibold bg-black text-white px-3 py-1 rounded-full uppercase tracking-widest",
  title: "text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight max-w-xl text-center",
};

export const metadata: Metadata = generatePageMetadata({
  title: "Blog",
  description: "Latest articles, insights, and updates about restaurant management, industry trends, and best practices.",
  path: "/blog",
});

// Custom page constants
const PAGE_CONFIG = {
  miniTitle: "Blogs",
  title: "Take a look at the latest articles from Luvy",
};

export default function BlogPage() {
  // Filter published blogs
  const blogs = (articles as Article[]).filter(b => b.isPublished);

  return (
    <div className={classes.container}> 
      <div className={classes.contentWrapper}>
        <BlogHero />

        <div className={classes.headerContainer}>
          <DynamicContent 
            as="p" 
            className={classes.miniTitle}
          >
            {PAGE_CONFIG.miniTitle}
          </DynamicContent>

          <DynamicContent as="h2" className={classes.title}>
            {PAGE_CONFIG.title}
          </DynamicContent>
        </div>

        <BlogGridWrapper blogs={blogs} />
      </div>
    </div>
  );
}
