"use client";

import React, { useState } from "react";
import articles from "@/data/articles.json";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Article } from "./BlogCard";
import BlogCard from "./BlogCard";
import BlogList from "./BlogList";
import DynamicContent from "./Title";

// --- Dynamic Tailwind Classes ---
const classes = {
  container: "relative mx-auto my-16 flex max-w-7xl flex-col items-center justify-center px-4 overflow-hidden",
  contentWrapper: "relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  header: "text-center",
  title: "text-3xl sm:text-4xl lg:text-6xl font-semibold mb-6 text-black",
  description: "text-base sm:text-lg text-gray-600 max-w-3xl mx-auto",
  mobileContainer: "block lg:hidden relative w-full overflow-visible",
  mobileSlider: "flex items-center justify-center min-h-[600px] relative",
  mobileCardWrapper: "w-full flex justify-center",
  mobileControls: "absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 pointer-events-none",
  mobileButton: "p-3 rounded-full bg-white/80 shadow-lg border border-gray-200 pointer-events-auto hover:bg-white transition-all",
  mobileButtonIcon: "w-6 h-6 text-black",
  pagination: "flex justify-center gap-3 mt-6",
  paginationDot: "h-2 rounded-full transition-all",
  paginationDotActive: "w-8 bg-black",
  paginationDotInactive: "w-2 bg-gray-300",
  desktopGrid: "hidden lg:block w-full",
};

export default function TrendingBlogs() {
  const [index, setIndex] = useState(0);
  const blogs = (articles as Article[]).filter((b) => b.isPublished).slice(0, 3);

  const nextStep = () => setIndex((prev) => (prev + 1) % blogs.length);
  const prevStep = () => setIndex((prev) => (prev - 1 + blogs.length) % blogs.length);

  return (
    <div className={classes.container}>
      <div className={classes.contentWrapper}>
        
        {/* Header Section */}
        <motion.div className={classes.header}>
          <DynamicContent as="h4" className={classes.title}>
            The Latest & Trending
          </DynamicContent>
          <DynamicContent as="p" className={classes.description}>
            Stay ahead of the curve with expert insights and restaurant innovation.
          </DynamicContent>
        </motion.div>

        {/* --- MOBILE & TABLET SLIDER (Hidden on LG and up) --- */}
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

            {/* Navigation Arrows */}
            <div className={classes.mobileControls}>
              <button 
                onClick={prevStep}
                className={classes.mobileButton}
              >
                <ChevronLeft className={classes.mobileButtonIcon} />
              </button>
              <button 
                onClick={nextStep}
                className={classes.mobileButton}
              >
                <ChevronRight className={classes.mobileButtonIcon} />
              </button>
            </div>
          </div>
          
          {/* Pagination dots */}
          <div className={classes.pagination}>
            {blogs.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`${classes.paginationDot} ${index === i ? classes.paginationDotActive : classes.paginationDotInactive}`}
              />
            ))}
          </div>
        </div>

        {/* --- DESKTOP GRID (LG & XL screens) --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className={classes.desktopGrid}
        >
          <BlogList blogs={blogs} />
        </motion.div>
      </div>
    </div>
  );
}
