"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { fadeUpVariants, animationConfig } from '@/lib/animations'

// Dynamic imports for code splitting
const Capabilities = dynamic(() => import('@/components/Capabilities'), {
  loading: () => <div className="min-h-100" />,
  ssr: true,
});

const RestaurantLeadersHub = dynamic(() => import('@/components/RestaurantLeadersHub'), {
  loading: () => <div className="min-h-100" />,
  ssr: true,
});

const HeroSectionOne = dynamic(() => import('@/components/HeroSection').then(mod => ({ default: mod.HeroSectionOne })), {
  loading: () => <div className="min-h-125" />,
  ssr: true,
});

const TrendingBlogs = dynamic(() => import('@/components/TrendingBlogs'), {
  loading: () => <div className="min-h-100" />,
  ssr: true,
});

const classes = {
  main: "",
  section: "",
};

const Page = memo(() => {
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
});

Page.displayName = "HomePage";

export default Page;
