"use client";

import { motion } from "framer-motion";
import Capabilities from '@/components/Capabilities'
import RestaurantLeadersHub from '@/components/RestaurantLeadersHub'
import { HeroSectionOne } from '@/components/HeroSection'
import TrendingBlogs from '@/components/TrendingBlogs'
import { fadeUpVariants, animationConfig } from '@/lib/animations'

// --- Dynamic Tailwind Classes ---
const classes = {
  main: "",
  section: "",
};

const Page = () => {
  return (
    <main className={classes.main}>
      <HeroSectionOne />

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={animationConfig.viewport}
        variants={fadeUpVariants}
        className={classes.section}
      >
        <Capabilities />
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={animationConfig.viewport}
        variants={fadeUpVariants}
        className={classes.section}
      >
        <RestaurantLeadersHub />
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={animationConfig.viewport}
        variants={fadeUpVariants}
        className={classes.section}
      >
        <TrendingBlogs />
      </motion.section>
    </main>
  );
};

export default Page;
