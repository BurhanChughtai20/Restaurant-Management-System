"use client";

import React, { useState, useRef } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { motion, Variants, AnimatePresence, useInView } from "framer-motion";
import DynamicContent from "./Title";
import Image from "next/image";
import Avatar from "@/assets/icon.svg";
import { ChevronLeft, ChevronRight, UtensilsCrossed } from "lucide-react";

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
      <div className="md:hidden flex flex-col items-center w-full">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={mobileIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full flex justify-center"
          >
            <Card className="w-[90%] p-5">
              <CardHeader>
                <div className="flex gap-4 items-center">
                   <UtensilsCrossed className="w-6 h-6 text-black" strokeWidth={2.5} />
                  <div>
                    <h4 className="font-semibold">
                      {testimonials[mobileIndex].name}
                    </h4>
                    <p className="text-sm text-default-400">
                      {testimonials[mobileIndex].restaurantName}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardBody className="text-center">
                <DynamicContent as="p">
                  {testimonials[mobileIndex].testimonial}
                </DynamicContent>
              </CardBody>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-6 mt-6">
          <button onClick={mobilePrev} className="p-2 rounded-full border">
            <ChevronLeft />
          </button>
          <button onClick={mobileNext} className="p-2 rounded-full border">
            <ChevronRight />
          </button>
        </div>
      </div>
 
      <div ref={sectionRef} className="hidden md:block relative w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={desktopIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-3 gap-6"
          >
            {testimonials
              .slice(desktopIndex, desktopIndex + DESKTOP_VISIBLE_COUNT)
              .map((owner, index) => (
                <Card key={index} className="p-5">
                  <CardHeader>
                    <div className="flex gap-4 items-center">
                       <UtensilsCrossed className="w-6 h-6 text-black" strokeWidth={2.5} />
                      <div>
                        <h4 className="font-semibold">{owner.name}</h4>
                        <p className="text-sm text-default-400">
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
          <div className="flex justify-center gap-6 mt-8">
            <button
              onClick={desktopPrev}
              disabled={desktopIndex === 0}
              className="p-2 rounded-full cursor-pointer border disabled:opacity-40"
            >
              <ChevronLeft />
            </button>

            <button
              onClick={desktopNext}
              disabled={
                desktopIndex + DESKTOP_VISIBLE_COUNT >= testimonials.length
              }
              className="p-2 rounded-full cursor-pointer border disabled:opacity-40"
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
