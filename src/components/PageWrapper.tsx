"use client";

import { motion, Variants } from "framer-motion";
import React from "react";

// --- Dynamic Tailwind Classes ---
const classes = {
  wrapper: "",
  section: "",
};

interface PageWrapperProps {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  sectionClassName?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  variants,
  className = "",
  sectionClassName = "",
}) => {
  return (
    <main className={`${classes.wrapper} ${className}`}>
      {React.Children.map(children, (child, index) => (
        <motion.section
          key={index}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={variants}
          className={`${classes.section} ${sectionClassName}`}
        >
          {child}
        </motion.section>
      ))}
    </main>
  );
};

export default PageWrapper;
