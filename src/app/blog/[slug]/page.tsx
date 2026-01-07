import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import articles from "@/data/articles.json";
import { Article } from "@/components/BlogCard";
import DynamicContent from "@/components/Title";

interface BlogDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogDetail({ params }: BlogDetailProps) {
  const { slug } = await params;
  const blog = (articles as Article[]).find((b) => b.slug === slug);

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h2 className="text-2xl font-bold text-gray-800">Blog not found</h2>
        <Link href="/blog" className="mt-4 text-blue-600 hover:underline">
          ← Back to all blogs
        </Link>
      </div>
    );
  }

  // Format the date nicely
  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 md:py-16">
      {/* Navigation & Metadata */}
      <div className="mb-8">
        <Link 
          href="/blog" 
          className="text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors"
        >
          ← Back to Blog
        </Link>
        <div className="mt-6 flex items-center gap-3 text-sm text-gray-500">
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold">
            Food & Dining
          </span>
          <span>•</span>
          <time dateTime={blog.createdAt}>{formattedDate}</time>
        </div>
      </div>

      {/* Title Section */}
      <DynamicContent as="h3" className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-8">
        {blog.title}
      </DynamicContent>

      {/* Featured Image */}
      <div className="relative w-full h-75 md:h-100 rounded-2xl overflow-hidden mb-12 shadow-xl">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content Section */}
      <div className="prose prose-lg max-w-none">
        <DynamicContent as="p" className="text-xl text-gray-700 leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left">
          {blog.description}
        </DynamicContent>
        
        {/* Placeholder for more content to show UI depth */}
        <div className="mt-8 p-6 bg-gray-50 rounded-xl border-l-4 border-orange-500 ">
          <DynamicContent as="p" className={"bg-gray-50 italic text-gray-600"}>
            
          Food is not just eating fuel, it&apos;s an experience that brings people together.
          </DynamicContent>
        </div>
        
        <DynamicContent as="p" className="mt-8 text-gray-700 leading-relaxed">
          As we continue to explore the culinary landscape, stay tuned for more reviews
          and deep dives into the world&lsquo;s most beloved kitchens.
        </DynamicContent>
      </div>

      {/* Footer / Share */}
      <footer className="mt-16 pt-8 border-t border-gray-100">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            Published by <strong>Restaurant Guide</strong>
          </div>
          <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-all">
            Share this Article
          </button>
        </div>
      </footer>
    </article>
  );
}