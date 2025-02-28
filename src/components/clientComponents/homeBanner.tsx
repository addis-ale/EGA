"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const homeBanner = [
  { imgUrl: "/imageAssets/chess.png", alt: "Chess banner image" },
  { imgUrl: "/imageAssets/chess.png", alt: "Artboard banner image" },
  { imgUrl: "/imageAssets/chess.png", alt: "Artboard 2 banner image" },
  { imgUrl: "/imageAssets/chess.png", alt: "Artboard 3 banner image" },
];

const SLIDE_DURATION = 5000; // 5 seconds

export default function HomeBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % homeBanner.length);
    }, SLIDE_DURATION);

    return () => {
      clearInterval(slideInterval);
    };
  }, []);

  return (
    <div className=" hidden md:flex relative w-full  h-[200px] xs:h-[250px] sm:h-[300px] md:h-[400px] lg:h-[450px] md:mt-[50px] lg:mt-[120px]">
      {/* Main Slider */}
      <div className="relative flex-grow h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="relative h-full w-full"
          >
            <Image
              src={homeBanner[currentSlide].imgUrl || "/placeholder.svg"}
              alt={homeBanner[currentSlide].alt}
              fill
              priority
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right Side Indicators (Full Height of Slider) */}
      <div className=" sm:flex flex-col justify-between items-center h-full w-4 sm:w-6 md:w-8 lg:w-10">
        {/* Vertical Indicators (100% height) */}
        <div className="flex flex-col justify-around h-full w-full">
          {homeBanner.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="group relative flex-1 flex items-center justify-center w-full"
              aria-label={`Go to slide ${index + 1}`}
            >
              <motion.div
                className="w-[1px] sm:w-[2px] md:w-[3px] rounded-full bg-gray-400"
                initial={{ scale: index === currentSlide ? 1.2 : 1 }}
                animate={{
                  scale: index === currentSlide ? 1.2 : 1,
                  backgroundColor:
                    index === currentSlide
                      ? "RGB(40, 151, 1)"
                      : "rgb(180, 180, 180)",
                }}
                transition={{ duration: 0.3 }}
                style={{ height: `calc(200% / ${homeBanner.length})` }} // Increased height
              />
            </button>
          ))}
        </div>

        {/* Slide Counter */}
        <div className="text-[8px] xs:text-xs sm:text-sm md:text-base font-medium text-gray-600 mt-2">
          {currentSlide + 1}/{homeBanner.length}
        </div>
      </div>
    </div>
  );
}
