"use client";
import React from "react";
import Image from "next/image";
import { Zap, Users, Cpu, LayoutGrid, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import DynamicContent from "./Title";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
// 1. Import motion
import { motion } from "framer-motion";

// --- Dynamic Tailwind Classes ---
const classes = {
  section: "py-20 px-6",
  header: "max-w-6xl mx-auto text-center mb-8 flex flex-col items-center",
  title: "text-4xl md:text-5xl font-extrabold tracking-tight text-center max-w-2xl mx-auto",
  description: "mt-6 text-base sm:text-lg md:text-xl text-gray-500 max-w-3xl mx-auto",
  grid: "max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-6",
  cardContainer: "inter-var w-full",
  cardBody: "bg-white relative group/card border-slate-200 w-auto h-auto rounded-[2.5rem] p-4 border shadow-sm hover:shadow-xl transition-shadow duration-500 flex flex-col",
  imageContainer: "relative w-full aspect-[4/3] rounded-[2rem] bg-slate-100 border border-slate-200/50 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]",
  imageInner: "absolute inset-0 flex items-center justify-center p-10",
  image: "h-full w-full object-contain group-hover/card:scale-110 transition-transform duration-500",
  cardContent: "px-4 py-6",
  categoryContainer: "flex items-center gap-2 mb-3",
  categoryIconWrapper: "p-1.5 rounded-lg bg-lime-100/50",
  categoryLabel: "text-[10px] uppercase tracking-widest text-lime-700 font-bold",
  cardTitle: "text-xl font-bold text-slate-900 mb-2",
  cardDescription: "text-slate-500 text-sm leading-relaxed max-w-sm",
};

const cardData = [
  {
    id: 1,
    category: "Dynamic Flexibility",
    title: "Luvy Flex SaaS",
    description: "Experience fluidity in your workflow with our adaptive interface.",
    image: "/p1.svg",
    icon: <LayoutGrid className="w-4 h-4 text-lime-600" />,
    className: "md:col-span-1",
  },
   {
    id: 2,
    category: "Dynamic Flexibility",
    title: "Luvy Flex SaaS",
    description: "Experience fluidity in your workflow with our adaptive interface.",
    image: "/p2.svg",
    icon: <LayoutGrid className="w-4 h-4 text-lime-600" />,
    className: "md:col-span-1",
  },
   {
    id: 3,
    category: "Dynamic Flexibility",
    title: "Luvy Flex SaaS",
    description: "Experience fluidity in your workflow with our adaptive interface.",
    image: "/p3.svg",
    icon: <LayoutGrid className="w-4 h-4 text-lime-600" />,
    className: "md:col-span-1",
  },
   {
    id: 4,
    category: "Dynamic Flexibility",
    title: "Luvy Flex SaaS",
    description: "Experience fluidity in your workflow with our adaptive interface.",
    image: "/p2.svg",
    icon: <LayoutGrid className="w-4 h-4 text-lime-600" />,
    className: "md:col-span-1",
  },
   {
    id: 5,
    category: "Dynamic Flexibility",
    title: "Luvy Flex SaaS",
    description: "Experience fluidity in your workflow with our adaptive interface.",
    image: "/p1.svg",
    icon: <LayoutGrid className="w-4 h-4 text-lime-600" />,
    className: "md:col-span-1",
  },
 ];

 const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, 
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ProductShowDataImgComponent() {
  return (
    <section className={classes.section}>
      {/* 2. Animate the Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={classes.header}
      >
        <DynamicContent 
          as="h2" 
          className={classes.title}
        >
          Revolutionize Your Business with Luvy's Solutions
        </DynamicContent>

        <DynamicContent 
          as="p" 
          className={classes.description}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </DynamicContent>
      </motion.div>

      {/* 3. Animate the Grid with Stagger effect */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className={classes.grid}
      >
        {cardData.map((card) => (
          <motion.div key={card.id} variants={itemVariants} className={cn("w-full", card.className)}>
            <CardContainer className={classes.cardContainer}>
              <CardBody className={classes.cardBody}>
                
                <CardItem
                  translateZ="100"
                  className={classes.imageContainer}
                >
                  <div className={classes.imageInner}>
                    <Image
                      src={card.image}
                      height={400}
                      width={400}
                      className={classes.image}
                      alt={card.title}
                    />
                  </div>
                </CardItem>

                <div className={classes.cardContent}>
                  <CardItem translateZ="50" className={classes.categoryContainer}>
                    <div className={classes.categoryIconWrapper}>
                      {card.icon}
                    </div>
                    <h6 className={classes.categoryLabel}>
                      {card.category}
                    </h6>
                  </CardItem>

                  <CardItem translateZ="60" className={classes.cardTitle}>
                    {card.title}
                  </CardItem>

                  <CardItem as="p" translateZ="40" className={classes.cardDescription}>
                    {card.description}
                  </CardItem>
                </div> 
              </CardBody>
            </CardContainer>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
