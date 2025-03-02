"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ReviewCard } from "./reviewCard";
import { SingleStar } from "../singleStar";

interface Reviews {
  id: string;
  userId: string;
  productId: string;
  name: string;
  rating: number;
  numberOfLikes: number;
  numberOfDislikes: number;
  comment: string;
  createdAt: string; // ISO date string
}

interface ReviewSlider {
  review: Reviews[];
}

export function ReviewCarousel({ review }: ReviewSlider) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    // Function to check if screen is mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Mobile version
  if (isMobile) {
    return (
      <>
        <div className="flex items-center gap-2">
          <SingleStar />
          <span className="text-2xl text-white font-bold">Expert Feedback</span>
        </div>
        <Carousel className="w-full max-w-xs mx-auto">
          <CarouselContent>
            {review.map((comment, index) => (
              <CarouselItem key={index} className="pl-1">
                <div className="p-5">
                  <ReviewCard review={comment} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </>
    );
  }

  // Desktop/tablet version
  return (
    <>
      <div className="flex items-center gap-2">
        <SingleStar />
        <span className="text-2xl text-white font-bold">Expert Feedback</span>
      </div>
      <Carousel className="w-full">
        <CarouselContent className="-ml-1">
          {review.map((comment, index) => (
            <CarouselItem
              key={index}
              className="pl-1 md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                <ReviewCard review={comment} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
}
