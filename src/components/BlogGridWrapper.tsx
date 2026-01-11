"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BlogCard, { Article } from "./BlogCard";

// --- Dynamic Tailwind Classes ---
const classes = {
  container: "w-full",
  mobileContainer: "block lg:hidden relative w-full overflow-hidden px-2",
  mobileSlider: "flex items-center justify-center min-h-[550px] relative",
  mobileCardWrapper: "w-full flex justify-center",
  mobileControls: "absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 pointer-events-none",
  mobileButton: "p-2 rounded-full bg-white shadow-md pointer-events-auto border border-gray-100",
  desktopGrid: "hidden lg:grid grid-cols-2 xl:grid-cols-3 gap-8",
};

interface BlogGridWrapperProps {
  blogs: Article[];
}

export default function BlogGridWrapper({ blogs }: BlogGridWrapperProps) {
  const [index, setIndex] = useState(0);

  const nextStep = () => setIndex((prev) => (prev + 1) % blogs.length);
  const prevStep = () => setIndex((prev) => (prev - 1 + blogs.length) % blogs.length);

  return (
    <div className={classes.container}>
      {/* --- MOBILE & TABLET SLIDER --- */}
      <div className={classes.mobileContainer}>
        <div className={classes.mobileSlider}>
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className={classes.mobileCardWrapper}
            >
              <BlogCard blog={blogs[index]} />
            </motion.div>
          </AnimatePresence>

          <div className={classes.mobileControls}>
            <button onClick={prevStep} className={classes.mobileButton}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextStep} className={classes.mobileButton}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* --- DESKTOP GRID --- */}
      <div className={classes.desktopGrid}>
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
}
