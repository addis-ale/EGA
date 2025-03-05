"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { Product } from "@prisma/client";
import { Bungee } from "next/font/google";
import { truncateText } from "@/utils/helper";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

const bungee = Bungee({
  subsets: ["latin"],
  weight: "400",
});

interface ProductCarouselProps {
  dealOfTheWeek: Product[];
  totaldeal: number;
}

export default function ProductCarousel({
  dealOfTheWeek,
  totaldeal,
}: ProductCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // Set up autoplay plugin
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  React.useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap());
    });
  }, [api]);

  // Get the current product name
  const currentProductName =
    dealOfTheWeek[currentIndex % totaldeal]?.productName;
  const router = useRouter();
  return (
    <div className="w-full  text-white py-6">
      {/* Title at the top */}
      <div className="text-start mb-6">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
          Deal Of The Week
        </h1>
      </div>

      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: true,
          skipSnaps: false,
          dragFree: true,
          containScroll: "trimSnaps",
        }}
        plugins={[plugin.current]}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {[...dealOfTheWeek, ...dealOfTheWeek].map((product, index) => (
            <CarouselItem
              key={`${product.id}-${index}`}
              className="pl-2 md:pl-4 basis-1/3"
              onClick={() => router.push(`product/${product.id}`)}
            >
              <div className="aspect-square relative overflow-hidden rounded-lg border border-zinc-800">
                <Image
                  src={product.uploadedCoverImage || "/placeholder.svg"}
                  alt={product.productName}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 33vw, 33vw"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Product name at bottom */}
      <div className="flex flex-col justify-center items-center gap-2 py-6">
        <h3
          className={`text-2xl md:text-3xl font-bold uppercase tracking-wider ${bungee.className}`}
        >
          {truncateText(currentProductName)}
        </h3>
        <div className="text-sm mt-2 text-zinc-400">1500 deals</div>
        <Button className="flex items-center justify-center gap-2 bg-green-600 px-2 py-1 md:px-4 md:py-2 hover:bg-green-700 w-fit sm:w-auto">
          <ShoppingCart className="h-4 w-4 text-white" />
          <span className="text-white">Purchase Now</span>
        </Button>
      </div>
    </div>
  );
}
