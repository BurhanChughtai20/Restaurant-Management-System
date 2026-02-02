"use client";

import React from "react";
import { motion } from "framer-motion";
import DynamicContent from "./Title";
import { ChefHat, TrendingUp, Users, Zap, BarChart3, Clock, ArrowRight } from "lucide-react";
import { ButtonWithIcon } from "./Button";

// --- Dynamic Tailwind Classes ---
const classes = {
  container: "relative w-full py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden transition-colors duration-300",
  backgroundSvg: "absolute top-0 left-0 w-full h-full hidden md:block opacity-30",
  floatingOrb1: "absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-500 blur-3xl opacity-20",
  floatingOrb2: "absolute bottom-20 right-10 w-40 h-40 rounded-full bg-purple-500 blur-3xl opacity-20",
  mainContainer: "relative z-10 max-w-7xl flex flex-col items-center justify-center mx-auto px-4 sm:px-6 lg:px-8",
  headerContainer: "text-center mb-12 sm:mb-16 md:mb-20",
  titleBase: "text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight",
  titleWord: "inline-block mr-2 text-black",
  descriptionContainer: "text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto",
  capabilitiesGrid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8",
  capabilityCard: "group relative p-6 sm:p-8 rounded-xl bg-gradient-to-br transition-all duration-300 overflow-hidden border",
  cardBackground: "absolute inset-0 bg-gradient-to-br from-blue-800/0 to-purple-500/0 group-hover:from-gray-800/10 group-hover:to-white-700/10 transition-all duration-300",
  cardContent: "relative z-10",
  iconContainer: "mb-4 inline-flex p-3 rounded-lg transition-all duration-300",
  cardTitle: "text-lg sm:text-xl font-semibold mb-3 transition-colors duration-300",
  cardDescription: "text-sm sm:text-base transition-colors duration-300",
  hoverIndicator: "absolute bottom-0 left-0 h-1 bg-gradient-to-r from-gray-800 to-black",
  ctaContainer: "mt-12 sm:mt-16 md:mt-20 text-center",
  ctaText: "text-gray-400 text-base sm:text-lg mb-6",
  ctaButtonWrapper: "inline-block",
  ctaButton: "text-base sm:text-xl font-semibold px-8 sm:px-10 py-3 sm:py-4 hover:shadow-lg transition-shadow duration-300",
};

const Capabilities = () => {
   const capabilityTitles = [
    "Super charge Your Restaurant Operations"
  ];

  const capabilityDescriptions = [
    "Streamline every aspect of your restaurant with our comprehensive management system. From inventory to customer service, we've got you covered."
  ];

  const capabilities = [
    {
      icon: TrendingUp,
      title: "Boost Revenue",
      description: "Increase sales by 40% with optimized inventory and smart pricing strategies."
    },
    {
      icon: Users,
      title: "Better Customer Experience",
      description: "Deliver exceptional service with automated ordering and personalized recommendations."
    },
    {
      icon: Zap,
      title: "Lightning Fast Operations",
      description: "Process orders 10x faster with our intuitive kitchen display system."
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Reduce manual work by 80% and focus on what matters - great food and service."
    },
    {
      icon: BarChart3,
      title: "Data-Driven Insights",
      description: "Make informed decisions with real-time analytics and comprehensive reporting."
    },
    {
      icon: ChefHat,
      title: "Complete Menu Control",
      description: "Easily manage menus, recipes, and dietary information across all locations."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className={classes.container}>

      {/* Animated Background Elements */}
      <svg
        className={classes.backgroundSvg}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="50%" stopColor="#1f2937" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
        </defs>
        <path
          d="M0,40 Q25,20 50,30 T100,25"
          stroke="url(#lineGradient)"
          strokeWidth="0.3"
          fill="transparent"
        />
      </svg>

      {/* Floating Orbs */}
      <motion.div
        className={classes.floatingOrb1}
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className={classes.floatingOrb2}
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main Content Container */}
      <div className={classes.mainContainer}>
        
        {/* Header Section */}
        <motion.div
          className={classes.headerContainer}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {capabilityTitles.map((title, index) => (
            <DynamicContent
              key={index}
              as="h2"
              className={classes.titleBase}
            >
              {title.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                  whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                  className={classes.titleWord}
                >
                  {word}
                </motion.span>
              ))}
            </DynamicContent>
          ))}

          {capabilityDescriptions.map((desc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <DynamicContent
                as="p"
                className={classes.descriptionContainer}
              >
                {desc}
              </DynamicContent>
            </motion.div>
          ))}
        </motion.div>

        {/* Capabilities Grid */}
        <motion.div
          className={classes.capabilitiesGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {capabilities.map((capability, index) => {
            const IconComponent = capability.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.3 },
                }}
                className={classes.capabilityCard}
              >
                {/* Card Background Gradient */}
                <div className={classes.cardBackground} />
                
                <div className={classes.cardContent}>
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 1, rotate: 0 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className={classes.iconContainer}
                  >
                    <IconComponent size={28} />
                  </motion.div>

                  {/* Title */}
                  <DynamicContent
                    as="h3"
                    className={classes.cardTitle}
                  >
                
                    {capability.title}
                  </DynamicContent>

                  {/* Description */}
                  <DynamicContent
                    as="p"
                    className={classes.cardDescription}
                  >
                    {capability.description}
                  </DynamicContent>

                  {/* Hover Indicator */}
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    whileHover={{ opacity: 1, width: "100%" }}
                    transition={{ duration: 0.3 }}
                    className={classes.hoverIndicator}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className={classes.ctaContainer}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <DynamicContent
            as="p"
            className={classes.ctaText}
          >
            Ready to transform your restaurant?
          </DynamicContent>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={classes.ctaButtonWrapper}
          >
            <ButtonWithIcon
              text="Get Started Today!"
              size="default"
              variant="default"
              icon={<ArrowRight size={16} />}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Capabilities;
