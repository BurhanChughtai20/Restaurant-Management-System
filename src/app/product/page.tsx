import { Metadata } from "next";
import dynamic from "next/dynamic";
import { generatePageMetadata } from '@/lib/metadata'
import { routeConfig } from '@/lib/route-utils'

// Dynamic imports for code splitting
const LuvyFeaturesSection = dynamic(() => import('@/components/LuvyFeaturesSection'), {
  loading: () => <div className="min-h-[600px]" />,
  ssr: true,
});

const ProductHero = dynamic(() => import('@/components/ProductHero').then(mod => ({ default: mod.ProductHero })), {
  loading: () => <div className="min-h-[500px]" />,
  ssr: true,
});

const ProductShowDataImgComponent = dynamic(() => import('@/components/ProductShowDataImgComponent'), {
  loading: () => <div className="min-h-[600px]" />,
  ssr: true,
});

// --- Dynamic Tailwind Classes ---
const classes = {
  container: "",
};

export const metadata: Metadata = generatePageMetadata({
  title: "Product",
  description: "Discover our comprehensive restaurant management solutions. Streamline operations, boost efficiency, and grow your business.",
  path: "/product",
});

// Enable static generation with revalidation
export const revalidate = routeConfig.revalidate;

const ProductPage = () => {
  return (
    <div className={classes.container}>
      <ProductHero/> 
      <ProductShowDataImgComponent/>
      <LuvyFeaturesSection/>
    </div>
  );
};

export default ProductPage;
