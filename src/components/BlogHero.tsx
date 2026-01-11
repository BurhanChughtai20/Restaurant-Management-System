"use client";
import { motion, Variants } from "framer-motion"; // Import Variants type
import { BentoGrid, BentoGridItem } from "../components/ui/bento-grid";
import { BlogHeroImage } from "./BlogHeroImage"; 
import { NewsletterInput, SocialLinks } from "./NewsLetters";

// --- Dynamic Tailwind Classes ---
const classes = {
  bentoGrid: "max-w-7xl mx-auto px-4 md:px-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 md:auto-rows-[auto]",
  firstGrid: "col-span-1",
  gridItem1: "h-[300px] md:h-full p-2",
  secondGrid: "col-span-1 flex flex-col gap-4",
  gridItem2: "min-h-[180px]",
  gridItem3: "min-h-[220px]",
};

// Explicitly type the variants object
const fadeInVariant: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: "easeOut" // Now TS knows this matches the allowed Easing strings
    } 
  },
};

export function BlogHero() {
  return (
    <BentoGrid className={classes.bentoGrid}>
      {/* 1st Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInVariant}
        className={classes.firstGrid}
      >
        <BentoGridItem
          className={classes.gridItem1}
          header={<BlogHeroImage />}
        />
      </motion.div>

      {/* 2nd Grid */}
      <div className={classes.secondGrid}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInVariant}
        >
          <BentoGridItem
            title="Join the newsletter!"
            description={<NewsletterInput />}
            className={classes.gridItem2}
          />
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInVariant}
          // The transition prop here was also clashing with the variant transition. 
          // If you want a delay, it's cleaner to handle it in a custom variant or use 'custom' prop.
          transition={{ delay: 0.2 }} 
        >
          <BentoGridItem
            title="Follow Us:"
            description={<SocialLinks />}
            className={classes.gridItem3}
          />
        </motion.div>
      </div>
    </BentoGrid>
  );
}
