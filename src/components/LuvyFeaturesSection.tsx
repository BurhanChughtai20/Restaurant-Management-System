"use client";
import React from "react";
import { motion } from "motion/react"; // Using motion/react as per your import
import { cn } from "@/lib/utils";
import DynamicContent from "./Title"; 
import { Feather, Flame, Users, PieChart } from "lucide-react";

// --- Dynamic Tailwind Classes ---
const classes = {
  section: "py-10 bg-white overflow-hidden",
  container: "max-w-7xl mx-auto px-6",
  desktopGrid: "hidden lg:grid grid-cols-12 gap-8 items-center",
  leftColumn: "col-span-3 space-y-24",
  centerColumn: "col-span-6 flex flex-col items-center justify-center",
  rightColumn: "col-span-3 space-y-24",
  mobileContainer: "lg:hidden flex flex-col items-center",
  mobileScrollContainer: "w-full overflow-x-auto no-scrollbar snap-x snap-mandatory flex gap-6 pb-8",
  mobileCardWrapper: "min-w-[80%] sm:min-w-87.5 snap-center",
  featureCardBase: "flex flex-col items-center text-center group",
  featureCardMobile: "bg-gray-50/50 p-8 rounded-3xl border border-gray-100",
  iconContainer: "w-14 h-14 rounded-full bg-white shadow-lg shadow-gray-200/50 flex items-center justify-center mb-6 border border-gray-50 transition-transform group-hover:scale-110",
  centerVisualBase: "relative w-full max-w-112.5 flex flex-col items-center",
  expenseCard: "w-full bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/60 border border-gray-100 p-8 relative z-10",
  expenseCardHeader: "flex justify-between items-center mb-8",
  expenseCardHeaderLeft: "flex items-center gap-2",
  expenseCardHeaderIcon: "w-4 h-4 bg-gray-100 rounded flex items-center justify-center",
  expenseCardHeaderIconInner: "w-2 h-2 border border-gray-400",
  expenseCardHeaderText: "text-xs font-bold text-gray-800",
  expenseCardHeaderRight: "px-3 py-1 bg-gray-50 border border-gray-100 rounded-md text-[10px] text-gray-400 flex items-center gap-1 cursor-pointer",
  expenseBarsContainer: "space-y-4",
  barContainer: "flex items-center gap-4 relative",
  barLabel: "text-[10px] text-gray-400 w-16",
  barTrack: "flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden",
  barFill: "h-full rounded-full",
  barScale: "mt-12 w-full text-center",
  scaleLabels: "flex justify-between mt-6 px-16 text-[9px] text-gray-300 font-medium",
  creditScoreText: "text-[10px] text-gray-400 mb-1",
  tooltip: "absolute -top-10 right-0 bg-black text-white text-[10px] px-2 py-1 rounded-md font-mono",
  featureTitle: "text-gray-900 font-bold mb-3",
  featureDescription: "text-gray-500 text-sm leading-relaxed max-w-60",
  creditScoreBold: "font-bold text-gray-700",
  dropdownArrow: "text-[8px]",
};

// --- Types ---
interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  side: "left" | "right";
}

interface FeatureCardProps {
  feature: Feature;
  align?: "left" | "center" | "right";
  isMobile?: boolean;
}

const features: Feature[] = [
  {
    id: "f1",
    title: "Dynamic Flexibility",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sed mauris.",
    icon: <Feather className="w-5 h-5 text-gray-600" />,
    side: "left",
  },
  {
    id: "f2",
    title: "Effortless Automation",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sed mauris.",
    icon: <Flame className="w-5 h-5 text-gray-600" />,
    side: "left",
  },
  {
    id: "f3",
    title: "Collaboration Refined",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sed mauris.",
    icon: <Users className="w-5 h-5 text-gray-600" />,
    side: "right",
  },
  {
    id: "f4",
    title: "Data-Driven Precision",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sed mauris.",
    icon: <PieChart className="w-5 h-5 text-gray-600" />,
    side: "right",
  },
];

export default function LuvyFeaturesSection() {
  return (
    <section className={classes.section}>
      <div className={classes.container}>
        
        <div className={classes.desktopGrid}>
          <div className={classes.leftColumn}>
            {features.filter(f => f.side === "left").map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>

          <div className={classes.centerColumn}>
             <CenterVisual />
          </div>

          <div className={classes.rightColumn}>
             {features.filter(f => f.side === "right").map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </div>

        <div className={classes.mobileContainer}>
          <CenterVisual className="mb-12 scale-90 md:scale-100" />
          
          <div className={classes.mobileScrollContainer}>
            {features.map((feature) => (
              <div key={feature.id} className={classes.mobileCardWrapper}>
                <FeatureCard feature={feature} isMobile />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, isMobile = false }: FeatureCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className={cn(
        classes.featureCardBase,
        isMobile && classes.featureCardMobile
      )}
    >
      <div className={classes.iconContainer}>
        {feature.icon}
      </div>
      <DynamicContent as="h4" className={classes.featureTitle}>
        {feature.title}
      </DynamicContent>
      <DynamicContent as="p" className={classes.featureDescription}>
        {feature.description}
      </DynamicContent>
    </motion.div>
  );
}

function CenterVisual({ className }: { className?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={cn(classes.centerVisualBase, className)}
    >
      {/* Major Expenses Card */}
      <div className={classes.expenseCard}>
        <div className={classes.expenseCardHeader}>
            <div className={classes.expenseCardHeaderLeft}>
               <div className={classes.expenseCardHeaderIcon}>
                  <div className={classes.expenseCardHeaderIconInner} />
               </div>
               <span className={classes.expenseCardHeaderText}>Major Expenses</span>
            </div>
            <div className={classes.expenseCardHeaderRight}>
               Weekly <span className={classes.dropdownArrow}>▼</span>
            </div>
        </div>

        {/* Expense Bars with inner animations */}
        <div className={classes.expenseBarsContainer}>
          <Bar label="Personnel" color="bg-pink-400" width="60%" delay={0.2} />
          <Bar label="Overheads" color="bg-lime-400" width="90%" delay={0.4} showTooltip />
          <Bar label="Capital" color="bg-indigo-400" width="45%" delay={0.6} />
        </div>

        <div className={classes.scaleLabels}>
            <span>0</span><span>2K</span><span>4K</span><span>6K</span><span>8K</span><span>10K</span>
        </div>
      </div>

      {/* Credit Score Indicator */}
      <div className={classes.barScale}>
         <DynamicContent as="p" className={classes.creditScoreText}>
            Your <span className={classes.creditScoreBold}>credit score</span> is <span className={classes.creditScoreBold}>710</span>
         </DynamicContent>
         {/* ... rest of indicator ... */}
      </div>
    </motion.div>
  );
}

// Helper for animated bars
function Bar({ label, color, width, delay, showTooltip }: { label: string, color: string, width: string, delay: number, showTooltip?: boolean }) {
  return (
    <div className={classes.barContainer}>
      <span className={classes.barLabel}>{label}</span>
      <div className={classes.barTrack}>
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay, ease: "circOut" }}
          className={cn(classes.barFill, color)}
        />
      </div>
      {showTooltip && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.5 }}
          className={classes.tooltip}
        >
          $8,82.21
        </motion.div>
      )}
    </div>
  );
}