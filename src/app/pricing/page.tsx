import { Metadata } from "next";
import dynamic from "next/dynamic";
import { generatePageMetadata } from '@/lib/metadata'

// Dynamic imports for code splitting
const PricingCards = dynamic(() => import('@/components/PricingCards'), {
  loading: () => <div className="min-h-150" />,
  ssr: true,
});

const TrustedBy = dynamic(() => import('@/components/TrustedBy'), {
  loading: () => <div className="min-h-100" />,
  ssr: true,
});

// --- Dynamic Tailwind Classes ---
const classes = {
  container: "",
};

export const metadata: Metadata = generatePageMetadata({
  title: "Pricing",
  description: "Choose the perfect plan for your restaurant. Flexible pricing options to suit businesses of all sizes.",
  path: "/pricing",
});

// Enable static generation with revalidation (revalidate every hour)
export const revalidate = 3600;

const PricingPage = () => {
  return (
    <div className={classes.container}> 
      <PricingCards/>
      <TrustedBy/>
    </div>
  );
};

export default PricingPage;
