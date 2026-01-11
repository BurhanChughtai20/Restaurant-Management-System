"use client";

import { motion } from "motion/react";
import Image from "next/image";
import ProductBanner from "../../public/productHeroImg.svg";
import DynamicContent from "./Title";
import { ArrowRight, UtensilsCrossed } from "lucide-react";
import ButtonCom from "./Button";

// --- Dynamic Tailwind Classes ---
const classes = {
  container: "relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center",
  borderLeft: "absolute inset-y-0 left-0 h-full w-px bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 dark:bg-neutral-800/80",
  borderLeftInner: "absolute top-0 h-40 w-px bg-linear-to-b from-transparent via-blue-700 to-transparent",
  borderRight: "absolute inset-y-0 right-0 h-full w-px bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 dark:bg-neutral-800/80",
  borderRightInner: "absolute h-40 w-px bg-linear-to-b from-gray-900 via-gray-800 to-gray-900",
  borderBottom: "absolute inset-x-0 bottom-0 h-px w-full",
  borderBottomInner: "absolute mx-auto h-px w-40 bg-linear-to-b from-gray-900 via-gray-800 to-gray-900",
  contentWrapper: "px-4 py-10 md:py-20",
  heading: "relative z-10 mx-auto max-w-3xl text-center text-2xl font-bold text-balance md:text-4xl lg:text-6xl",
  headingWord: "mr-2 inline-block",
  introContainer: "relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal",
  introText: "text-base md:text-lg",
  buttonContainer: "relative z-10 mt-4 flex flex-wrap items-center justify-center gap-5",
  buttonInner: "flex justify-center items-center gap-y-3",
  imageContainer: "relative z-10 mt-10 rounded-3xl border p-4 shadow-md",
  imageWrapper: "w-full overflow-hidden rounded-xl border",
  image: "aspect-video h-auto w-full object-cover",
  iconContainer: "flex items-center justify-center mt-10",
};
 
export function ProductHero() {
   const headingText = "Manage of your own restaurant";
    const introTexts = [
  " Our software solutions help you manage and increase sales for your restaurant. From online ordering to inventory management, we have everything you need to run a successful restaurant."
];

  return (
    <div className={classes.container}>
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
         <h3 className={classes.heading}>
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
        </h3>

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
          className={classes.buttonContainer}
        >
          <div className={classes.buttonInner}>
          <ButtonCom
                        icon={<ArrowRight size={16} />}
                        iconPosition="right"
                        text="Get Started"
                        type="default"
                        className="my-primary-btn"
                        onClick={() => alert("Started")}
                      />
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
              src={ProductBanner}
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
