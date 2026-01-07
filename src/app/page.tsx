"use client";

import { motion, Variants } from "framer-motion";
import Capabilities from '@/components/Capabilities'
import RestaurantLeadersHub from '@/components/RestaurantLeadersHub'
import { HeroSectionOne } from '@/components/HeroSection'
import TrendingBlogs from '@/components/TrendingBlogs'

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: "easeOut" 
    } 
  },
};

const Page = () => {
  return (
    <main>
      <HeroSectionOne />

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUpVariants}
      >
        <Capabilities />
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUpVariants}
      >
        <RestaurantLeadersHub />
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUpVariants}
      >
        <TrendingBlogs />
      </motion.section>

    </main>
  );
};

export default Page;