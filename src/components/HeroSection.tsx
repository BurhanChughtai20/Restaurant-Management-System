"use client";

import { motion } from "motion/react";
import Image from "next/image";
import BannerImg from "../../public/banner.svg";
import DynamicContent from "./Title";
import IconImg from "@/assets/icon.svg";
import { UtensilsCrossed } from "lucide-react";

// --- Dynamic Tailwind Classes ---
const classes = {
  container: "relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center",
  borderLeft: "absolute inset-y-0 left-0 h-full w-px bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 dark:bg-neutral-800/80",
  borderLeftInner: "absolute top-0 h-40 w-px bg-linear-to-b from-transparent via-blue-700 to-transparent",
  borderRight: "absolute inset-y-0 right-0 h-full w-px bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 dark:bg-neutral-800/80",
  borderRightInner: "absolute h-40 w-px bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 to-transparent",
  borderBottom: "absolute inset-x-0 bottom-0 h-px w-full",
  borderBottomInner: "absolute mx-auto h-px w-40 bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 to-transparent",
  contentWrapper: "px-4 py-10 md:py-20",
  heading: "relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-balance md:text-4xl lg:text-7xl",
  headingWord: "mr-2 inline-block",
  introContainer: "relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal",
  introText: "text-base md:text-lg",
  statsContainer: "relative z-10 mt-8 flex flex-wrap items-center justify-center gap-5",
  statsInner: "flex justify-center items-center gap-y-3",
  statItem: "mx-4 text-center",
  statTitle: "text-xs font-semibold",
  statNumber: "text-xs",
  imageContainer: "relative z-10 mt-10 rounded-3xl border p-4 shadow-md",
  imageWrapper: "w-full overflow-hidden rounded-xl border",
  image: "aspect-video h-auto w-full object-cover",
  iconContainer: "flex items-center justify-center mt-10",
};

export function HeroSectionOne() {
   const headingText = "Launch your website in hours, not days";
    const introTexts = [
  "With AI, you can launch your website in hours, not days. Try our best in class, state of the art, cutting edge AI tools to get your website up."
];

  const statsData = [
    {
        title: "TOTAL USERS",
        number: "1,200+",
    },
    {
        title: "TOTAL VIEW",
        number: "50,000+",
    },
    {
        title: "TOTAL DOWNLOADS",
        number: "10,000+",
    }
  ]
  return (
    <div className={classes.container}>
      {/* borders / lines kept as is */}
      <div className={classes.borderLeft}>
        <div className={classes.borderLeftInner} />
      </div>
      <div className={classes.borderRight}>
        <div className={classes.borderRightInner} />
      </div>
      <div className={classes.borderBottom}>
        <div className={classes.borderBottomInner} />
      </div>

      <div className={classes.contentWrapper}>
        {/* Animated H1 using headingText */}
        <h1 className={classes.heading}>
          {headingText.split(" ").map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeInOut",
              }}
              className={classes.headingWord}
            >
              {word}
            </motion.span>
          ))}
        </h1>

         <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className={classes.introContainer}
        >
         {introTexts.map((text, index) => (
        <DynamicContent key={index} as="p" className={classes.introText}>
          {text}
        </DynamicContent>
      ))}
        </motion.div>

         <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          className={classes.statsContainer}
        >
          <div className={classes.statsInner}>
          {
            statsData.map((item, index) => (
                <div key={index} className={classes.statItem}>
                   <DynamicContent as="h5" className={classes.statTitle}>
                     {item.title}
                   </DynamicContent>
                   <DynamicContent as="h6" className={classes.statNumber}>
                     {item.number}
                   </DynamicContent>
                </div>
            ))
          }
          </div>
        </motion.div>

        {/* Image / banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.2 }}
          className={classes.imageContainer}
        >
          <div className={classes.imageWrapper}>
            <Image
              src={BannerImg}
              alt="Landing page preview"
              className={classes.image}
              height={1000}
              width={1000}
            />
          </div>
         
        </motion.div>
         <div className={classes.iconContainer}>
           <UtensilsCrossed className="w-6 h-6 text-black" strokeWidth={2.5} />
          </div>
      </div>
    </div>
  );
}
