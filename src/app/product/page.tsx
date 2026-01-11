import { Metadata } from "next";
import LuvyFeaturesSection from '@/components/LuvyFeaturesSection'
import { ProductHero } from '@/components/ProductHero'
import ProductShowDataImgComponent from '@/components/ProductShowDataImgComponent'
import { generatePageMetadata } from '@/lib/metadata'

// --- Dynamic Tailwind Classes ---
const classes = {
  container: "",
};

export const metadata: Metadata = generatePageMetadata({
  title: "Product",
  description: "Discover our comprehensive restaurant management solutions. Streamline operations, boost efficiency, and grow your business.",
  path: "/product",
});

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
