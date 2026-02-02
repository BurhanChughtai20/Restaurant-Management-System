"use client"
import { useState, useRef } from "react"
import { motion, AnimatePresence, Variants, useInView } from "framer-motion"
import { ChevronLeft, ChevronRight, UtensilsCrossed } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import DynamicContent from "./Title"

const DESKTOP_VISIBLE_COUNT = 3

const testimonials = [
  {
    name: "Ali Khan",
    restaurantName: "Spice Heaven",
    testimonial: "This system transformed our operations completely.",
  },
  {
    name: "Sara Ahmed",
    restaurantName: "The Gourmet Spot",
    testimonial: "Amazing platform! I highly recommend it.",
  },
  {
    name: "Imran Qureshi",
    restaurantName: "Burger Republic",
    testimonial: "Orders are faster and operations are smoother.",
  },
  {
    name: "Fatima Noor",
    restaurantName: "Cafe Aroma",
    testimonial: "Revenue increased within just a few months.",
  },
]

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    transition: { duration: 0.25 },
  }),
}

export default function Testimonials() {
  /* ---------------- MOBILE ---------------- */
  const [mobileIndex, setMobileIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const nextMobile = () => {
    setDirection(1)
    setMobileIndex((i) => (i + 1) % testimonials.length)
  }

  const prevMobile = () => {
    setDirection(-1)
    setMobileIndex((i) =>
      i === 0 ? testimonials.length - 1 : i - 1
    )
  }

  /* ---------------- DESKTOP ---------------- */
  const [desktopIndex, setDesktopIndex] = useState(0)
  const ref = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(ref, { margin: "-120px" })

  const nextDesktop = () => {
    if (desktopIndex + DESKTOP_VISIBLE_COUNT < testimonials.length) {
      setDesktopIndex((i) => i + DESKTOP_VISIBLE_COUNT)
    }
  }

  const prevDesktop = () => {
    if (desktopIndex - DESKTOP_VISIBLE_COUNT >= 0) {
      setDesktopIndex((i) => i - DESKTOP_VISIBLE_COUNT)
    }
  }

  return (
    <>
      {/* ================= MOBILE CAROUSEL ================= */}
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
            <Card className="w-[90%]">
              <CardHeader className="flex flex-row items-center gap-4">
                <UtensilsCrossed className="h-6 w-6" />
                <div>
                  <p className="font-semibold">
                    {testimonials[mobileIndex].name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonials[mobileIndex].restaurantName}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="text-center">
                <DynamicContent as="p">
                  {testimonials[mobileIndex].testimonial}
                </DynamicContent>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex gap-6">
          <button
            onClick={prevMobile}
            className="rounded-full border p-2 hover:bg-muted transition"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={nextMobile}
            className="rounded-full border p-2 hover:bg-muted transition"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* ================= DESKTOP GRID ================= */}
      <div ref={ref} className="hidden md:block w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={desktopIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-3 gap-6"
          >
            {testimonials
              .slice(desktopIndex, desktopIndex + DESKTOP_VISIBLE_COUNT)
              .map((item, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <UtensilsCrossed className="h-6 w-6" />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.restaurantName}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <DynamicContent as="p">
                      {item.testimonial}
                    </DynamicContent>
                  </CardContent>
                </Card>
              ))}
          </motion.div>
        </AnimatePresence>

        {isInView && testimonials.length > DESKTOP_VISIBLE_COUNT && (
          <div className="mt-8 flex justify-center gap-6">
            <button
              onClick={prevDesktop}
              disabled={desktopIndex === 0}
              className="rounded-full border p-2 disabled:opacity-40 hover:bg-muted transition"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={nextDesktop}
              disabled={
                desktopIndex + DESKTOP_VISIBLE_COUNT >= testimonials.length
              }
              className="rounded-full border p-2 disabled:opacity-40 hover:bg-muted transition"
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </>
  )
}
