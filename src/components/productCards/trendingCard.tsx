"use client";

import type React from "react";
import Image from "next/image";
import { ShoppingCart, Heart, Star } from "lucide-react";
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
import { usePathname, useRouter } from "next/navigation";
import { formatPrice, truncateText } from "@/utils/helper";
import { useWishlist } from "@/hooks/useWishlist";
import { useGetWishlistQuery } from "@/state/features/whishlistApi";
import DateRangeDialog from "../clientComponents/dateInput";
import { useCart } from "@/hooks/useCart";

const bungee = Bungee({
  subsets: ["latin"],
  weight: "400",
});

interface ProductListingCardProps {
  product: Product & {
    priceDetails: PriceDetails;
    reviews: Review[];
  };
}

export default function ProductListingCard({
  product,
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
  const rentalPricePerDay = priceDetails?.rentalPricePerDay ?? 0;

  const isOnSale = product.productType === "SALE";
  const isRent = product.productType === "RENT";
  const rentandsale = product.productType === "BOTH";

  const pathname = usePathname();
  const currentPath = pathname.split("/").slice(0, 2).join("/");
  const handleCardClick = () => {
    router.replace(`${currentPath}/product/${product.id}`);
  };

  const { handleAddToCart } = useCart();
  const handleSaveToBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleAddToCart(product, "SALE", 1);
  };

  return (
    <Card
      className="w-full overflow-hidden rounded-xl border shadow-md transition-all duration-300 group relative border-teal hover:border-green-500 hover:shadow-xl bg-gray-800"
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
            {rentandsale && (
              <Badge className="bg-red-500 hover:bg-red-600">Sale & Rent</Badge>
            )}
            {isOnSale && (
              <Badge className="bg-red-500 hover:bg-red-600">Sale</Badge>
            )}
            {isRent && (
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
          {rentalPricePerDay > 0 && (
            <Badge
              variant="outline"
              className="ml-auto font-normal bg-amber-50 text-amber-800 border-green-600"
            >
              Rental:{" "}
              {formatPrice(
                (product.priceDetails.rentalPricePerDay ?? 0) -
                  (product.priceDetails.rentalPricePerDay ?? 0) *
                    (product.discountPercentage / 100)
              )}
              /Day
            </Badge>
          )}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {salePrice > 0 && (
            <Button
              className="flex items-center justify-center gap-1 bg-shadGray/95 hover:bg-shadGray text-primary-foreground text-xs sm:text-sm"
              onClick={handleSaveToBuy}
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 " />
              <span className="hidden xs:inline">Save to buy</span>
              <span className="xs:hidden">Save to buy</span>
            </Button>
          )}
          {rentalPricePerDay && <DateRangeDialog product={product} />}
        </div>
      </div>
    </Card>
  );
}
