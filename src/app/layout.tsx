import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

 const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-rubik",
  display: "swap",
  preload: true,
});

 export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
};

export const metadata: Metadata = {
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
   openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    siteName: "Restaurant Management System",
    title: "Restaurant Management System",
    description: "An all-in-one solution for managing restaurant orders, inventory, and staff efficiently.",
    images: [
      {
        url: "https://your-domain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Restaurant Management System",
        type: "image/png",
      },
    ],
  },
   twitter: {
    card: "summary_large_image",
    title: "Restaurant Management System",
    description: "An all-in-one solution for managing restaurant orders, inventory, and staff efficiently.",
    creator: "@yourhandle",
    images: ["https://your-domain.com/og-image.png"],
  },
  // Additional metadata
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  alternates: {
    canonical: "https://your-domain.com",
  },
  manifest: "/manifest.json",
};

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Restaurant Management System",
  description: "An all-in-one solution for managing restaurant orders, inventory, and staff efficiently.",
  applicationCategory: "BusinessApplication",
  creator: {
    "@type": "Person",
    name: "Muhammad Burhan Chughtai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Preload fonts for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured data for search engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${rubik.variable} font-sans antialiased`}>
        {/* Suspense boundary for streaming and code splitting */}
        {children}
      </body>
    </html>
  );
}