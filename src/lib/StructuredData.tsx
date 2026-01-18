export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Restaurant Management System - Admin Dashboard",
    description: "Comprehensive admin dashboard for managing restaurant operations.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    creator: {
      "@type": "Person",
      name: "Muhammad Burhan Chughtai",
    },
  };

  return (
    <script
      id="admin-dashboard-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}