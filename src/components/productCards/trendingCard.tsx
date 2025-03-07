"use client";

import type React from "react";
import Image from "next/image";
import { ShoppingCart, Heart, Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bungee } from "next/font/google";
import type { PriceDetails, Product, Review } from "@prisma/client";
import { useRouter } from "next/navigation";
import { formatPrice, truncateText } from "@/utils/helper";
import { useWishlist } from "@/hooks/useWishlist";
import { useGetWishlistQuery } from "@/state/features/whishlistApi";

const bungee = Bungee({
  subsets: ["latin"],
  weight: "400",
});

interface ProductListingCardProps {
  product: Product & {
    priceDetails: PriceDetails;
    reviews: Review[];
  };
  onAddToCart?: (productId: string) => void;
  onRentNow?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
}

export default function ProductListingCard({
  product,
  onAddToCart,
  onRentNow,
}: ProductListingCardProps) {
  const { handleToggleWishlist } = useWishlist();
  const { data: wishlistData } = useGetWishlistQuery();

  // Check if the product is already in the wishlist
  const isInWishlist = wishlistData?.wishlist?.some(
    (item) => item.id === product.id
  );
  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleToggleWishlist(product);
  };
  const router = useRouter();
  const rating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      : 0;
  const reviewCount = product.reviews.length;

  const isNew =
    product.createdAt &&
    new Date(product.createdAt).getTime() >
      Date.now() - 30 * 24 * 60 * 60 * 1000;

  const priceDetails = product?.priceDetails;
  const salePrice = priceDetails?.salePrice ?? 0;
  const rentalPricePerHour = priceDetails?.rentalPricePerHour ?? 0;
  // const originalPrice =
  //   salePrice > 0 && product.discountPercentage > 0
  //     ? salePrice / (1 - product.discountPercentage / 100)
  //     : salePrice;
  const isOnSale = salePrice > 0;
  const isRent = rentalPricePerHour > 0;
  const rentandsale = isOnSale && isRent;

  const handleCardClick = () => {
    const currentLocation = window.location.pathname
      .split("/")
      .slice(0, 2)
      .join("");
    router.push(`${currentLocation}/product/${product.id}`);
  };

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <Card
      className="w-full overflow-hidden rounded-xl border shadow-md transition-all duration-300 group relative border-teal hover:border-green-500 hover:shadow-xl"
      onClick={handleCardClick}
    >
      {/* Image section with badges and buttons */}
      <div className="relative h-48 w-full sm:h-56 md:h-64 lg:h-52 xl:h-56 overflow-hidden bg-gray-800">
        <Image
          src={product.uploadedCoverImage || "/imageAssets/artboard.png"}
          alt={`${product.productName} product image`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />

        {/* Action buttons that appear on hover */}
        <div className="absolute right-3 top-1 flex flex-col gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white z-10 h-9 w-9 shadow-sm transition-transform duration-300 hover:scale-110"
                  onClick={handleWishlist}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isInWishlist
                        ? "fill-red-500 text-red-500"
                        : "text-gray-700 hover:text-red-500"
                    }`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add to Wishlist</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Content section below the image */}
      <div className="p-4 bg-gray-800">
        {/* Category */}
        {product.gameType && (
          <p className="text-sm text-muted-foreground mb-1 text-white font-sans italic">
            {product.gameType}
          </p>
        )}

        {/* Product name */}
        <div className="flex justify-between items-center">
          <h2
            className={`text-lg sm:text-xl md:text-2xl font-[400] tracking-wider text-white ${bungee.className}`}
          >
            {truncateText(product.productName, 5)}
          </h2>
          <div className=" flex flex-col gap-2">
            {isNew && (
              <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
            )}
            {rentandsale ? (
              <Badge className="bg-red-500 hover:bg-red-600">Sale & Rent</Badge>
            ) : isOnSale ? (
              <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>
            ) : (
              <Badge className="bg-red-500 hover:bg-red-600">Rent</Badge>
            )}
          </div>
        </div>

        {/* Ratings */}
        <div className="flex items-center mt-1 mb-2 text-white">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating)
                    ? "fill-amber-400 text-amber-400"
                    : i < rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm  text-white">({reviewCount})</span>
        </div>

        {/* Price information */}
        <div className="flex flex-wrap items-center gap-2 mt-2 mb-4 bg-olivegreen">
          {salePrice > 0 && (
            <div className="flex items-center gap-2">
              <p className="text-teal font-bold text-xl">
                {formatPrice(
                  salePrice - (salePrice * product.discountPercentage) / 100
                )}
              </p>
              {isOnSale && (
                <p className="text-sm text-red-500 line-through">
                  {formatPrice(salePrice)}
                </p>
              )}
            </div>
          )}
          {rentalPricePerHour > 0 && (
            <Badge
              variant="outline"
              className="ml-auto font-normal bg-amber-50 text-amber-800 border-green-600"
            >
              Rental:{" "}
              {formatPrice(
                (product.priceDetails.rentalPricePerHour ?? 0) -
                  (product.priceDetails.rentalPricePerHour ?? 0) *
                    (product.discountPercentage / 100)
              )}
              /Hour
            </Badge>
          )}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button
            className="flex items-center justify-center gap-1 bg-shadGray/95 hover:bg-shadGray text-primary-foreground text-xs sm:text-sm"
            onClick={(e) =>
              handleActionClick(e, () => onAddToCart?.(product.id))
            }
          >
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 " />
            <span className="hidden xs:inline">Add to cart</span>
            <span className="xs:hidden">Cart</span>
          </Button>

          <Button
            variant="outline"
            className="flex items-center justify-center gap-1 border-primary text-primary bg-teal hover:bg-teal/90 text-xs sm:text-sm"
            onClick={(e) => handleActionClick(e, () => onRentNow?.(product.id))}
          >
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            <span className="text-white hidden xs:inline">Rent Now</span>
            <span className="text-white xs:hidden">Rent</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
