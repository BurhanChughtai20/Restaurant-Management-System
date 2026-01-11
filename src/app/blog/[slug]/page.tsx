import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import articles from "@/data/articles.json";
import { Article } from "@/components/BlogCard";
import DynamicContent from "@/components/Title";
import { generatePageMetadata } from "@/lib/metadata";

// --- Dynamic Tailwind Classes ---
const classes = {
  notFoundContainer: "flex flex-col items-center justify-center min-h-[60vh] px-4",
  notFoundTitle: "text-2xl font-bold text-gray-800",
  notFoundLink: "mt-4 text-blue-600 hover:underline",
  article: "max-w-4xl mx-auto px-4 py-8 md:py-16",
  navContainer: "mb-8",
  backLink: "text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors",
  metaContainer: "mt-6 flex items-center gap-3 text-sm text-gray-500",
  categoryBadge: "bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold",
  title: "text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-8",
  imageWrapper: "relative w-full h-75 md:h-100 rounded-2xl overflow-hidden mb-12 shadow-xl",
  image: "object-cover",
  contentWrapper: "prose prose-lg max-w-none",
  description: "text-xl text-gray-700 leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left",
  quoteBox: "mt-8 p-6 bg-gray-50 rounded-xl border-l-4 border-orange-500",
  quoteText: "bg-gray-50 italic text-gray-600",
  footerText: "mt-8 text-gray-700 leading-relaxed",
  footer: "mt-16 pt-8 border-t border-gray-100",
  footerContent: "flex flex-wrap justify-between items-center gap-4",
  footerTextSmall: "text-sm text-gray-500",
  shareButton: "bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-all",
};

interface BlogDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = (articles as Article[]).find((b) => b.slug === slug && b.isPublished);

  if (!blog) {
    return generatePageMetadata({
      title: "Blog Not Found",
      description: "The requested blog post could not be found.",
      path: `/blog/${slug}`,
    });
  }

  return generatePageMetadata({
    title: blog.title,
    description: blog.description,
    path: `/blog/${slug}`,
    image: blog.image,
  });
}

export async function generateStaticParams() {
  const publishedBlogs = (articles as Article[]).filter((a) => a.isPublished);
  return publishedBlogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogDetail({ params }: BlogDetailProps) {
  const { slug } = await params;
  const blog = (articles as Article[]).find((b) => b.slug === slug && b.isPublished);

  if (!blog) {
    notFound();
  }

  // Format the date nicely
  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className={classes.article}>
      {/* Navigation & Metadata */}
      <div className={classes.navContainer}>
        <Link 
          href="/blog" 
          className={classes.backLink}
        >
          ← Back to Blog
        </Link>
        <div className={classes.metaContainer}>
          <span className={classes.categoryBadge}>
            Food & Dining
          </span>
          <span>•</span>
          <time dateTime={blog.createdAt}>{formattedDate}</time>
        </div>
      </div>

      {/* Title Section */}
      <DynamicContent as="h3" className={classes.title}>
        {blog.title}
      </DynamicContent>

      {/* Featured Image */}
      <div className={classes.imageWrapper}>
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className={classes.image}
          priority
        />
      </div>

      {/* Content Section */}
      <div className={classes.contentWrapper}>
        <DynamicContent as="p" className={classes.description}>
          {blog.description}
        </DynamicContent>
        
        {/* Placeholder for more content to show UI depth */}
        <div className={classes.quoteBox}>
          <DynamicContent as="p" className={classes.quoteText}>
            Food is not just eating fuel, it&apos;s an experience that brings people together.
          </DynamicContent>
        </div>
        
        <DynamicContent as="p" className={classes.footerText}>
          As we continue to explore the culinary landscape, stay tuned for more reviews
          and deep dives into the world&lsquo;s most beloved kitchens.
        </DynamicContent>
      </div>

      {/* Footer / Share */}
      <footer className={classes.footer}>
        <div className={classes.footerContent}>
          <div className={classes.footerTextSmall}>
            Published by <strong>Restaurant Guide</strong>
          </div>
          <button className={classes.shareButton}>
            Share this Article
          </button>
        </div>
      </footer>
    </article>
  );
}
