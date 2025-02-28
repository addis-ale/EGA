"use client";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";

export default function ImageSlider() {
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <Carousel
        opts={{
          loop: true,
          align: "center",
          containScroll: "trimSnaps",
          dragFree: true,
        }}
        className="w-full cursor-grab active:cursor-grabbing"
      >
        <CarouselContent ref={emblaRef} className="-ml-2 sm:-ml-4">
          {[1, 2, 3].map((index) => (
            <CarouselItem
              key={index}
              className="pl-2 sm:pl-4 basis-[85%] sm:basis-[70%] md:basis-[60%] lg:basis-1/2 xl:basis-[45%]"
            >
              <Card className="border-0 overflow-hidden">
                <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full">
                  <Image
                    src={`/placeholder.svg?height=450&width=800&text=Image ${index}`}
                    alt={`Landscape ${index}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 85vw, (max-width: 768px) 70vw, (max-width: 1024px) 60vw, (max-width: 1280px) 50vw, 45vw"
                    priority={index === 1}
                  />
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
