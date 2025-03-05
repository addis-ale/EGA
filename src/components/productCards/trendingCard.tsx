"use client";

import type React from "react";

import Image from "next/image";
import { ShoppingCart, Clock, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bungee } from "next/font/google";

import { useWishlist } from "@/hooks/useWishlist";
import type { Product } from "@prisma/client";
import { useRouter } from "next/navigation";

const bungee = Bungee({
  subsets: ["latin"],
  weight: "400",
});

interface ProductListingCardProps {
  product: Product;
  currency?: string;
  rentalPrice?: number;
}

export default function ProductListingCard({
  product,
  currency = "ETB",
  rentalPrice,
}: ProductListingCardProps) {
  const { handleAddToWishlist } = useWishlist();
  const handleAddToWishlistWithOptimisticUpdate = async (
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    await handleAddToWishlist(product);
  };
  const router = useRouter();

  return (
    <Card
      className="w-full max-w-md overflow-hidden rounded-xl border shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border-gray-800"
      onClick={() => router.push(`/product/${product.id}`)}
    >
      {/* Image section with favorite button */}
      <div className="relative h-64 w-full sm:h-72">
        <Image
          src="/imageAssets/artboard.png"
          alt={`${product.productName} product image`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority
        />

        {/* Favorite button at top right */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleAddToWishlistWithOptimisticUpdate}
          className="absolute top-3 right-3 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white z-10 h-9 w-9"
        >
          <Heart className="h-5 w-5 text-gray-700 hover:text-red-500" />
        </Button>
      </div>

      {/* Content section below the image */}
      <div className="p-4 bg-gray-900 text-white">
        {/* Product name */}
        <h2
          className={`text-xl sm:text-2xl font-[400] tracking-wider  ${bungee.className}`}
        >
          {product.productName}
        </h2>

        {/* Price information */}
        <div className="flex justify-between items-center mt-2 mb-4">
          <p className="text-lg font-medium ">
            {product.price} {currency}
          </p>
          {rentalPrice && (
            <p className="text-sm font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded-md">
              Rental: {rentalPrice} {currency}/day
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700">
            <ShoppingCart className="h-4 w-4" />
            <span>Buy Now</span>
          </Button>

          <Button className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700">
            <Clock className="h-4 w-4" />
            <span>Rent Now</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
