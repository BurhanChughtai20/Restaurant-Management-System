import { Metadata } from "next";
import { baseMetadata } from '@/lib/metadata'

// Blog layout metadata
export const metadata: Metadata = {
  ...baseMetadata,
  title: "Blog",
  description: "Latest articles, insights, and updates about restaurant management, industry trends, and best practices.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
