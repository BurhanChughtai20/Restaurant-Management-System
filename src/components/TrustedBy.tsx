"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import DynamicContent from "@/components/Title";

const trustedData = {
  heading: "Trusted by thousands of SaaS teams.",
  paragraphs: [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam venenatis orci sit amet lobortis tristique.",
    "Aliquam euismod lacinia tortor, a convallis magna varius quis. Praesent tempor dui eu maximus scelerisque. Duis dapibus vehicula vulputate.",
  ],
  stats: {
    count: "24,320",
    label: "Reviews In 2024",
    platform: "Trustpilot",
  }
};

const TrustedBy = () => {
  return (
    <section className="px-6 py-20 bg-white dark:bg-black w-full overflow-hidden">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Left Side: Dynamic Text Content with Viewport Trigger */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          // viewport once: true prevents re-rendering/re-animating on scroll up
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 space-y-6"
        >
          <DynamicContent as="h2" className="text-4xl md:text-5xl font-bold text-black dark:text-white leading-tight">
            {trustedData.heading}
          </DynamicContent>
          
          <div className="space-y-4 max-w-lg">
            {trustedData.paragraphs.map((text, idx) => (
              <DynamicContent key={idx} as="p" className="text-gray-600 dark:text-neutral-400 text-sm leading-relaxed">
                {text}
              </DynamicContent>
            ))}
          </div>
        </motion.div>

        {/* Right Side: 3D Card with staggered reveal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 flex justify-center md:justify-end w-full"
        >
          <CardContainer className="inter-var">
            <CardBody className="bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 w-full sm:w-[400px] h-auto rounded-2xl p-8 shadow-xl shadow-black/[0.03]">
              
              <CardItem translateZ="50">
                <DynamicContent as="span" className="text-neutral-600 dark:text-neutral-300 font-medium">
                  <b className="text-black dark:text-white">{trustedData.stats.count}</b> {trustedData.stats.label}
                </DynamicContent>
              </CardItem>

              <div className="flex items-center justify-between mt-10">
                <CardItem translateZ="60" className="flex items-center gap-2">
                  <Star className="fill-black text-black dark:fill-white dark:text-white" size={24} />
                  <DynamicContent as="h5" className="text-xl font-black tracking-tighter text-black dark:text-white">
                    {trustedData.stats.platform}
                  </DynamicContent>
                </CardItem>

                <CardItem translateZ="80" className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="bg-black dark:bg-white p-1 rounded-sm">
                      <Star size={12} className="text-white dark:text-black fill-current" />
                    </div>
                  ))}
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        </motion.div>

      </div>
    </section>
  );
};

export default TrustedBy;