"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import { ReviewCard } from "./reviewCard";

interface Review {
  id: string;
  userId: string;
  productId: string;
  name: string;
  rating: number;
  numberOfLikes: number;
  numberOfDislikes: number;
  comment: string;
  createdAt: string;
}

interface ReviewSliderProps {
  reviews: Review[];
}

export function ReviewSlider({ reviews }: ReviewSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSlidesPerView(3); // Large screens (lg+)
      } else if (window.innerWidth >= 768) {
        setSlidesPerView(2); // Medium screens (md)
      } else {
        setSlidesPerView(1); // Small screens (xs, sm)
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = reviews.length;
  const loopedReviews = [...reviews, ...reviews.slice(0, slidesPerView)];

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, totalSlides]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, totalSlides]);

  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div className="px-4 sm:px-6" {...handlers}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-1 sm:gap-2">
          <Star className="h-5 w-5 sm:h-6 sm:w-6 fill-yellow-400 text-yellow-400" />
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Expert Feedback
          </h1>
        </div>
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={prevSlide}
            className="p-1 sm:p-2 rounded-full bg-[#3a3a3a] hover:bg-[#4a4a4a] transition-colors"
            aria-label="Previous reviews"
            disabled={isAnimating}
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="p-1 sm:p-2 rounded-full bg-[#3a3a3a] hover:bg-[#4a4a4a] transition-colors"
            aria-label="Next reviews"
            disabled={isAnimating}
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex gap-4 transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)`,
            width: `${(loopedReviews.length / slidesPerView) * 100}%`,
          }}
        >
          {loopedReviews.map((review, index) => (
            <div
              key={`${review.id}-${index}`}
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / slidesPerView}%` }}
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
