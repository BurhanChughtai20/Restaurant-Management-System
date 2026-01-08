"use client";
import React from "react";
import { motion } from "motion/react";
import DynamicContent from "@/components/Title";

const PricingHero = () => {
  const headingText = "Manage your own restaurant";

  const introTexts = [
    "Our software solutions help you manage and increase sales for your restaurant. From online ordering to inventory management, we have everything you need to run a successful restaurant.",
  ];

  return (
    <div className="relative mx-auto mt-20 flex max-w-7xl flex-col items-center justify-center">
      <div className="px-4 py-10 md:py-10">
        <h3 className="relative z-10 mx-auto max-w-3xl text-center text-2xl font-bold text-balance md:text-4xl lg:text-6xl">
          {headingText.split(" ").map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              // Use whileInView instead of animate
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              // viewport: once ensures it doesn't re-animate every time you scroll up/down
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeInOut",
              }}
              className="mr-2 inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h3>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal"
        >
          {introTexts.map((text, index) => (
            <DynamicContent key={index} as="p" className="text-base md:text-lg">
              {text}
            </DynamicContent>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PricingHero;