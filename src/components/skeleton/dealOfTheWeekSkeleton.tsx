"use client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function ProductCarouselLoading() {
  // Create placeholder items for the carousel
  const skeletonItems = Array.from({ length: 3 }, (_, i) => i);

  return (
    <div className="w-full text-white py-6">
      {/* Title skeleton */}
      <div className="text-start mb-6">
        <Skeleton className="h-10 w-64 bg-zinc-800" />
      </div>

      {/* Carousel skeleton */}
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {skeletonItems.map((index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/3">
              <div className="aspect-square relative overflow-hidden rounded-lg border border-zinc-800">
                <Skeleton className="h-full w-full bg-zinc-800" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Product info skeleton */}
      <div className="flex flex-col justify-center items-center gap-2 py-6">
        <Skeleton className="h-8 w-64 bg-zinc-800" />
        <Skeleton className="h-4 w-24 mt-2 bg-zinc-800" />
        <Skeleton className="h-10 w-40 mt-2 rounded-md bg-zinc-800" />
      </div>
    </div>
  );
}
