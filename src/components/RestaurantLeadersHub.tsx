"use client";
import { motion } from 'framer-motion';
import DynamicContent from './Title';
 import { UtensilsCrossed } from 'lucide-react';
import Testimonials from './Testimonials';
 
const RestaurantLeadersHub = () => {
    const headingText = "Restaurant leaders' hub, connecting you to their networks.";
const paragraphText = "Join a thriving community of restaurant owners and leaders. Share insights, exchange ideas, and grow together in the dynamic world of hospitality.";
  return (
    <div className={`relative w-full  py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden transition-colors duration-300`}>
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-100 blur-3xl opacity-30"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-orange-100 blur-3xl opacity-30"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

       <div className='relative z-10 mx-auto max-w-7xl flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8'>
         <motion.div
          className="text-center lg:text-start mb-12 sm:mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center justify-center px-4 py-2 bg-orange-100 border border-orange-300 rounded-full mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <UtensilsCrossed size={18} className="text-orange-600 mr-2" />
            <DynamicContent as="span" className="text-sm text-orange-600 font-medium">
              RESTAURANT OWNERS
            </DynamicContent>
          </motion.div>

          <DynamicContent
            as="h2"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-black"
          >
            {headingText.split(" ").map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                viewport={{ once: true }}
                className="inline-block mr-2"
              >
                {word}
              </motion.span>
            ))}
          </DynamicContent>

          <DynamicContent
            as="p"
            className="text-base sm:text-lg md:text-xl text-gray-600 mt-6"
          >
            {paragraphText}
          </DynamicContent>
        </motion.div>
 
            <Testimonials/>
      </div>
    </div>
  )
}

export default RestaurantLeadersHub
