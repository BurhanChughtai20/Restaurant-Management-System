"use client";

import React from "react";
import { Check, ArrowRight } from "lucide-react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { ButtonWithIcon } from "./Button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Dynamic Tailwind Classes ---
const classes = {
  section: "px-6 py-10 dark:bg-black bg-white overflow-hidden",
  container: "mx-auto flex max-w-7xl flex-col items-stretch justify-center gap-10 md:flex-row md:gap-12",
  cardContainer: "inter-var w-full",
  cardBodyBase: "relative group/card w-full h-full min-h-[550px] rounded-3xl p-8 border transition-all flex flex-col justify-between shadow-sm",
  cardBodyPopular: "bg-white dark:bg-neutral-900 border-black/10 shadow-2xl",
  cardBodyNormal: "bg-neutral-50/50 dark:bg-neutral-950 border-black/5",
  badgeContainer: "absolute top-6 right-8",
  badge: "bg-black text-white dark:bg-white dark:text-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold",
  planName: "text-sm font-bold uppercase tracking-widest text-gray-700 dark:text-gray-400",
  price: "mt-4 text-6xl font-extrabold text-black dark:text-white",
  priceUnit: "text-lg font-medium text-neutral-500",
  description: "mt-4 text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed",
  divider: "h-px w-full bg-neutral-200 dark:bg-neutral-800 my-8",
  featuresList: "flex flex-col gap-4",
  featureItem: "flex items-center gap-3 text-sm font-medium text-neutral-700 dark:text-neutral-300",
  checkIconContainer: "flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center",
  buttonWrapper: "mt-12 w-full",
  buttonBase: "w-full justify-center py-6 rounded-2xl text-base transition-transform group-hover/card:scale-[1.02]",
  buttonPopular: "!bg-black !text-white shadow-xl",
  buttonNormal: "!bg-neutral-100 !text-black border border-neutral-200",
};

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for individuals getting started with restaurant management.",
    features: ["14 Days Trial", "Basic Inventory", "Email Support"],
    buttonText: "Get Started",
    isPopular: false,
  },
  {
    name: "Pro",
    price: "$20",
    description: "Advanced tools for growing businesses needing full control.",
    features: ["Unlimited Sales", "Inventory Management", "24/7 Priority Support"],
    buttonText: "Upgrade to Pro",
    isPopular: true,
  },
];

const PricingCards = () => {
  return (
    <section className={classes.section}>
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={classes.container}
      >
        {pricingPlans.map((plan) => (
          <CardContainer key={plan.name} className={classes.cardContainer}>
            <CardBody 
              className={cn(
                classes.cardBodyBase,
                plan.isPopular ? classes.cardBodyPopular : classes.cardBodyNormal
              )}
            >
              <div>
                {plan.isPopular && (
                  <CardItem translateZ="30" className={classes.badgeContainer}>
                    <span className={classes.badge}>
                      Most Popular
                    </span>
                  </CardItem>
                )}

                <CardItem
                  translateZ="50"
                  className={classes.planName}
                >
                  {plan.name}
                </CardItem>

                <CardItem
                  translateZ="60"
                  className={classes.price}
                >
                  {plan.price}
                  <span className={classes.priceUnit}>/mo</span>
                </CardItem>

                <CardItem
                   translateZ="40"
                   className={classes.description}
                >
                  {plan.description}
                </CardItem>

                <div className={classes.divider} />

                <CardItem translateZ="30" className="w-full">
                  <ul className={classes.featuresList}>
                    {plan.features.map((feature) => (
                      <li key={feature} className={classes.featureItem}>
                        <div className={classes.checkIconContainer}>
                          <Check size={12} className="text-green-600 dark:text-green-400" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardItem>
              </div>

              <CardItem translateZ="80" className={classes.buttonWrapper}>
                <ButtonWithIcon
                  icon={<ArrowRight size={18} />}
                  iconPosition="right"
                  text={plan.buttonText}
                  appearance={plan.isPopular ? "primary" : "default"}
                  className={cn(
                    classes.buttonBase,
                    plan.isPopular ? classes.buttonPopular : classes.buttonNormal
                  )}
                  onClick={() => alert(`Selected: ${plan.name}`)}
                />
              </CardItem>
            </CardBody>
          </CardContainer>
        ))}
      </motion.div>
    </section>
  );
};

export default PricingCards;
