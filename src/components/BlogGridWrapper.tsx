"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BlogCard, { Article } from "./BlogCard";

interface BlogGridWrapperProps {
  blogs: Article[];
}

export default function BlogGridWrapper({ blogs }: BlogGridWrapperProps) {
  const [index, setIndex] = useState(0);

  const nextStep = () => setIndex((prev) => (prev + 1) % blogs.length);
  const prevStep = () => setIndex((prev) => (prev - 1 + blogs.length) % blogs.length);

  return (
    <div className="w-full">
      {/* --- MOBILE & TABLET SLIDER --- */}
      <div className="block lg:hidden relative w-full overflow-hidden px-2">
        <div className="flex items-center justify-center min-h-[550px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center"
            >
              <BlogCard blog={blogs[index]} />
            </motion.div>
          </AnimatePresence>

          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 pointer-events-none">
            <button onClick={prevStep} className="p-2 rounded-full bg-white shadow-md pointer-events-auto border border-gray-100">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextStep} className="p-2 rounded-full bg-white shadow-md pointer-events-auto border border-gray-100">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* --- DESKTOP GRID --- */}
      <div className="hidden lg:grid grid-cols-2 xl:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
}