"use client";

import React, { useState, useRef } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { motion, Variants, AnimatePresence, useInView } from "framer-motion";
import DynamicContent from "./Title";
import Image from "next/image";
import Avatar from "@/assets/icon.svg";
import { ChevronLeft, ChevronRight, UtensilsCrossed } from "lucide-react";

// --- Dynamic Tailwind Classes ---
const classes = {
  mobileContainer: "md:hidden flex flex-col items-center w-full",
  mobileCardWrapper: "w-full flex justify-center",
  mobileCard: "w-[90%] p-5",
  mobileCardHeader: "flex gap-4 items-center",
  mobileName: "font-semibold",
  mobileRestaurant: "text-sm text-default-400",
  mobileCardBody: "text-center",
  mobileControls: "flex gap-6 mt-6",
  mobileButton: "p-2 rounded-full border",
  desktopContainer: "hidden md:block relative w-full",
  desktopGrid: "grid grid-cols-3 gap-6",
  desktopCard: "p-5",
  desktopCardHeader: "flex gap-4 items-center",
  desktopName: "font-semibold",
  desktopRestaurant: "text-sm text-default-400",
  desktopControls: "flex justify-center gap-6 mt-8",
  desktopButton: "p-2 rounded-full cursor-pointer border disabled:opacity-40",
};

const DESKTOP_VISIBLE_COUNT = 3;

function Testimonials() {
  const testimonials = [
    {
      name: "Ali Khan",
      restaurantName: "Spice Heaven",
      city: "Karachi, Pakistan",
      imageUrl: Avatar,
      testimonial: "This system transformed our operations completely.",
      rating: 5,
    },
    {
      name: "Sara Ahmed",
      restaurantName: "The Gourmet Spot",
      city: "Lahore, Pakistan",
      imageUrl: Avatar,
      testimonial: "Amazing platform! I highly recommend it.",
      rating: 5,
    },
    {
      name: "Imran Qureshi",
      restaurantName: "Burger Republic",
      city: "Islamabad, Pakistan",
      imageUrl: Avatar,
      testimonial: "Orders are faster and operations are smoother.",
      rating: 5,
    },
    {
      name: "Fatima Noor",
      restaurantName: "Cafe Aroma",
      city: "Karachi, Pakistan",
      imageUrl: Avatar,
      testimonial: "Revenue increased within just a few months.",
      rating: 5,
    },
  ];

  /* ========================= */
  /* 📱 MOBILE STATE */
  /* ========================= */
  const [mobileIndex, setMobileIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const mobileNext = () => {
    setDirection(1);
    setMobileIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const mobilePrev = () => {
    setDirection(-1);
    setMobileIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  /* ========================= */
  /* 💻 DESKTOP STATE */
  /* ========================= */
  const [desktopIndex, setDesktopIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { margin: "-100px" });

  const desktopNext = () => {
    if (desktopIndex + DESKTOP_VISIBLE_COUNT < testimonials.length) {
      setDesktopIndex((prev) => prev + DESKTOP_VISIBLE_COUNT);
    }
  };

  const desktopPrev = () => {
    if (desktopIndex - DESKTOP_VISIBLE_COUNT >= 0) {
      setDesktopIndex((prev) => prev - DESKTOP_VISIBLE_COUNT);
    }
  };

  /* ========================= */
  /* 🎞 MOTION VARIANTS */
  /* ========================= */
  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.3 },
    }),
  };

  return (
    <>
      {/* ===================== */}
      {/* 📱 MOBILE SLIDER */}
      {/* ===================== */}
      <div className={classes.mobileContainer}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={mobileIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className={classes.mobileCardWrapper}
          >
            <Card className={classes.mobileCard}>
              <CardHeader>
                <div className={classes.mobileCardHeader}>
                   <UtensilsCrossed className="w-6 h-6 text-black" strokeWidth={2.5} />
                  <div>
                    <h4 className={classes.mobileName}>
                      {testimonials[mobileIndex].name}
                    </h4>
                    <p className={classes.mobileRestaurant}>
                      {testimonials[mobileIndex].restaurantName}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardBody className={classes.mobileCardBody}>
                <DynamicContent as="p">
                  {testimonials[mobileIndex].testimonial}
                </DynamicContent>
              </CardBody>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className={classes.mobileControls}>
          <button onClick={mobilePrev} className={classes.mobileButton}>
            <ChevronLeft />
          </button>
          <button onClick={mobileNext} className={classes.mobileButton}>
            <ChevronRight />
          </button>
        </div>
      </div>
 
      <div ref={sectionRef} className={classes.desktopContainer}>
        <AnimatePresence mode="wait">
          <motion.div
            key={desktopIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            className={classes.desktopGrid}
          >
            {testimonials
              .slice(desktopIndex, desktopIndex + DESKTOP_VISIBLE_COUNT)
              .map((owner, index) => (
                <Card key={index} className={classes.desktopCard}>
                  <CardHeader>
                    <div className={classes.desktopCardHeader}>
                       <UtensilsCrossed className="w-6 h-6 text-black" strokeWidth={2.5} />
                      <div>
                        <h4 className={classes.desktopName}>{owner.name}</h4>
                        <p className={classes.desktopRestaurant}>
                          {owner.restaurantName}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardBody>
                    <DynamicContent as="p">
                      {owner.testimonial}
                    </DynamicContent>
                  </CardBody>
                </Card>
              ))}
          </motion.div>
        </AnimatePresence>

        {isInView && testimonials.length > DESKTOP_VISIBLE_COUNT && (
          <div className={classes.desktopControls}>
            <button
              onClick={desktopPrev}
              disabled={desktopIndex === 0}
              className={classes.desktopButton}
            >
              <ChevronLeft />
            </button>

            <button
              onClick={desktopNext}
              disabled={
                desktopIndex + DESKTOP_VISIBLE_COUNT >= testimonials.length
              }
              className={classes.desktopButton}
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Testimonials;
