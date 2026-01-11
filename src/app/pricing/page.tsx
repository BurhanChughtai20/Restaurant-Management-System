import { Metadata } from "next";
import dynamic from "next/dynamic";
import { generatePageMetadata } from '@/lib/metadata'
import { routeConfig } from '@/lib/route-utils'

// Dynamic imports for code splitting
const PricingCards = dynamic(() => import('@/components/PricingCards'), {
  loading: () => <div className="min-h-[600px]" />,
  ssr: true,
});

const PricingHero = dynamic(() => import('@/components/PricingHero'), {
  loading: () => <div className="min-h-[300px]" />,
  ssr: true,
});

const TrustedBy = dynamic(() => import('@/components/TrustedBy'), {
  loading: () => <div className="min-h-[400px]" />,
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

// Enable static generation with revalidation
export const revalidate = routeConfig.revalidate;

const PricingPage = () => {
  return (
    <div className={classes.container}>
      <PricingHero/>
      <PricingCards/>
      <TrustedBy/>
    </div>
  );
};

export default PricingPage;
