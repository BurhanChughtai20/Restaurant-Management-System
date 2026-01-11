import { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import articles from "@/data/articles.json";
import { Article } from "@/components/BlogCard";
import { generatePageMetadata } from '@/lib/metadata'
import { SuspenseBoundary } from "@/components/SuspenseBoundary";

// Dynamic imports
const BlogGridWrapper = dynamic(() => import('@/components/BlogGridWrapper'), {
  loading: () => <div className="min-h-[600px]" />,
  ssr: true,
});

const BlogHero = dynamic(() => import('@/components/BlogHero').then(mod => ({ default: mod.BlogHero })), {
  loading: () => <div className="min-h-[400px]" />,
  ssr: true,
});

const DynamicContent = dynamic(() => import('@/components/Title'), {
  ssr: true,
});

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

// Enable static generation with revalidation (revalidate every hour)
export const revalidate = 3600;

// Custom page constants
const PAGE_CONFIG = {
  miniTitle: "Blogs",
  title: "Take a look at the latest articles from Luvy",
};

// Memoized blog list calculation
function getPublishedBlogs(): Article[] {
  return (articles as Article[]).filter(b => b.isPublished);
}

export default function BlogPage() {
  // Filter published blogs (memoized at module level would be better, but this works)
  const blogs = getPublishedBlogs();

  return (
    <div className={classes.container}> 
      <div className={classes.contentWrapper}>
        <SuspenseBoundary>
          <BlogHero />
        </SuspenseBoundary>

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

        <SuspenseBoundary>
          <BlogGridWrapper blogs={blogs} />
        </SuspenseBoundary>
      </div>
    </div>
  );
}
