"use client";

import { motion } from "motion/react";
import Image from "next/image";
import BannerImg from "../../public/banner.svg";
import DynamicContent from "./Title";
import IconImg from "@/assets/icon.svg";
import { UtensilsCrossed } from "lucide-react";
 
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
    <div className={`relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center`}>
      {/* borders / lines kept as is */}
      <div className="absolute inset-y-0 left-0 h-full w-px bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-linear-to-b from-transparent via-blue-700 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 to-transparent" />
      </div>
      <div className={`absolute inset-x-0 bottom-0 h-px w-full `}>
        <div className="absolute mx-auto h-px w-40 bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 to-transparent" />
      </div>

      <div className="px-4 py-10 md:py-20">
        {/* Animated H1 using headingText */}
        <h1 className={`relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-balance md:text-4xl lg:text-7xl `}>
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
              className="mr-2 inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h1>

         <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className={`relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal`}
        >
         {introTexts.map((text, index) => (
        <DynamicContent key={index} as="p" className={`text-base md:text-lg`}>
          {text}
        </DynamicContent>
      ))}
        </motion.div>

         <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-5"
        >
          <div className="flex justify-center items-center gap-y-3">
          {
            statsData.map((item, index) => (
                <div key={index} className="mx-4 text-center">
                   <DynamicContent as="h5" className={`text-xs font-semibold`}>
                     {item.title}
                   </DynamicContent>
                   <DynamicContent as="h6" className={`text-xs`}>
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
          className={`relative z-10 mt-10 rounded-3xl border p-4 shadow-md`}
        >
          <div className={`w-full overflow-hidden rounded-xl border`}>
            <Image
              src={BannerImg}
              alt="Landing page preview"
              className="aspect-video h-auto w-full object-cover"
              height={1000}
              width={1000}
            />
          </div>
         
        </motion.div>
         <div className="flex items-center justify-center mt-10">
           <UtensilsCrossed className="w-6 h-6 text-black" strokeWidth={2.5} />
          </div>
      </div>
    </div>
  );
}
