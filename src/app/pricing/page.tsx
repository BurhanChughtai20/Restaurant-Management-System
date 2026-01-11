import { Metadata } from "next";
import PricingCards from '@/components/PricingCards';
import PricingHero from '@/components/PricingHero'
import TrustedBy from '@/components/TrustedBy';
import { generatePageMetadata } from '@/lib/metadata'

// --- Dynamic Tailwind Classes ---
const classes = {
  container: "",
};

export const metadata: Metadata = generatePageMetadata({
  title: "Pricing",
  description: "Choose the perfect plan for your restaurant. Flexible pricing options to suit businesses of all sizes.",
  path: "/pricing",
});

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
