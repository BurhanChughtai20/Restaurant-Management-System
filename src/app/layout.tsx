import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { NavbarCom } from "@/components/navbar-menu";
import Footer from "@/components/Footer";
import { baseMetadata } from "@/lib/metadata";
import { SuspenseBoundary } from "@/components/SuspenseBoundary";

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
  ...baseMetadata,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    ...baseMetadata.openGraph,
    url: baseMetadata.metadataBase?.toString() || "https://your-domain.com",
    title: "Restaurant Management System",
    description: baseMetadata.description || "",
    images: [
      {
        url: `${baseMetadata.metadataBase || "https://your-domain.com"}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Restaurant Management System",
        type: "image/png",
      },
    ],
  },
  twitter: {
    ...baseMetadata.twitter,
    title: "Restaurant Management System",
    description: baseMetadata.description || "",
    images: [`${baseMetadata.metadataBase || "https://your-domain.com"}/og-image.png`],
  },
  alternates: {
    canonical: baseMetadata.metadataBase?.toString() || "https://your-domain.com",
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
    <html lang="en" dir="ltr" suppressHydrationWarning>
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
      <body className={`${rubik.variable} font-sans antialiased`} suppressHydrationWarning>
        <SuspenseBoundary>
          <NavbarCom/>
        </SuspenseBoundary>
        <SuspenseBoundary>
          {children}
        </SuspenseBoundary>
        <SuspenseBoundary>
          <Footer/>
        </SuspenseBoundary>
      </body>
    </html>
  );
}
