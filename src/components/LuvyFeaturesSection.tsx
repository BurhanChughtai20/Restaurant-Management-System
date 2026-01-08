"use client";
import React from "react";
import { motion } from "motion/react"; // Using motion/react as per your import
import { cn } from "@/lib/utils";
import DynamicContent from "./Title"; 
import { Feather, Flame, Users, PieChart } from "lucide-react";

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
    <section className="py-10 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="hidden lg:grid grid-cols-12 gap-8 items-center">
          <div className="col-span-3 space-y-24">
            {features.filter(f => f.side === "left").map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>

          <div className="col-span-6 flex flex-col items-center justify-center">
             <CenterVisual />
          </div>

          <div className="col-span-3 space-y-24">
             {features.filter(f => f.side === "right").map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </div>

        <div className="lg:hidden flex flex-col items-center">
          <CenterVisual className="mb-12 scale-90 md:scale-100" />
          
          <div className="w-full overflow-x-auto no-scrollbar snap-x snap-mandatory flex gap-6 pb-8">
            {features.map((feature) => (
              <div key={feature.id} className="min-w-[80%] sm:min-w-87.5 snap-center">
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
        "flex flex-col items-center text-center group",
        isMobile && "bg-gray-50/50 p-8 rounded-3xl border border-gray-100"
      )}
    >
      <div className="w-14 h-14 rounded-full bg-white shadow-lg shadow-gray-200/50 flex items-center justify-center mb-6 border border-gray-50 transition-transform group-hover:scale-110">
        {feature.icon}
      </div>
      <DynamicContent as="h4" className="text-gray-900 font-bold mb-3">
        {feature.title}
      </DynamicContent>
      <DynamicContent as="p" className="text-gray-500 text-sm leading-relaxed max-w-60">
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
      className={cn("relative w-full max-w-112.5 flex flex-col items-center", className)}
    >
      {/* Major Expenses Card */}
      <div className="w-full bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/60 border border-gray-100 p-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
               <div className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center">
                  <div className="w-2 h-2 border border-gray-400" />
               </div>
               <span className="text-xs font-bold text-gray-800">Major Expenses</span>
            </div>
            <div className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-md text-[10px] text-gray-400 flex items-center gap-1 cursor-pointer">
               Weekly <span className="text-[8px]">▼</span>
            </div>
        </div>

        {/* Expense Bars with inner animations */}
        <div className="space-y-4">
          <Bar label="Personnel" color="bg-pink-400" width="60%" delay={0.2} />
          <Bar label="Overheads" color="bg-lime-400" width="90%" delay={0.4} showTooltip />
          <Bar label="Capital" color="bg-indigo-400" width="45%" delay={0.6} />
        </div>

        <div className="flex justify-between mt-6 px-16 text-[9px] text-gray-300 font-medium">
            <span>0</span><span>2K</span><span>4K</span><span>6K</span><span>8K</span><span>10K</span>
        </div>
      </div>

      {/* Credit Score Indicator */}
      <div className="mt-12 w-full text-center">
         <DynamicContent as="p" className="text-[10px] text-gray-400 mb-1">
            Your <span className="font-bold text-gray-700">credit score</span> is <span className="font-bold text-gray-700">710</span>
         </DynamicContent>
         {/* ... rest of indicator ... */}
      </div>
    </motion.div>
  );
}

// Helper for animated bars
function Bar({ label, color, width, delay, showTooltip }: { label: string, color: string, width: string, delay: number, showTooltip?: boolean }) {
  return (
    <div className="flex items-center gap-4 relative">
      <span className="text-[10px] text-gray-400 w-16">{label}</span>
      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay, ease: "circOut" }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
      {showTooltip && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.5 }}
          className="absolute -top-10 right-0 bg-black text-white text-[10px] px-2 py-1 rounded-md font-mono"
        >
          $8,82.21
        </motion.div>
      )}
    </div>
  );
}