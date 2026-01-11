import { Metadata } from "next";

// --- Base Metadata Configuration ---
export const baseMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com"),
  title: {
    default: "Restaurant Management System",
    template: "%s | RMS",
  },
  description: "An all-in-one solution for managing restaurant orders, inventory, and staff efficiently.",
  keywords: [
    "Restaurant Management",
    "POS System",
    "Inventory Tracking",
    "Staff Management",
    "RMS",
    "Restaurant Software",
  ],
  authors: [{ name: "Muhammad Burhan Chughtai" }],
  creator: "Muhammad Burhan Chughtai",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Restaurant Management System",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@yourhandle",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Helper function to generate page metadata
export function generatePageMetadata({
  title,
  description,
  path = "",
  image,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const url = `${baseMetadata.metadataBase}${path}`;
  const ogImage = image || `${baseMetadata.metadataBase}/og-image.png`;

  return {
    title,
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      ...baseMetadata.twitter,
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}
