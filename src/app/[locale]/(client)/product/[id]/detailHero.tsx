"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Share2, ShoppingCart, Info, Clock } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type {
  PriceDetails,
  Product,
  Review,
  VideoUploaded,
} from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { SingleStar } from "@/components/singleStar";
import { formatPrice } from "@/utils/helper";
import { EnhancedVideoPlayer } from "./enhancedVideoPlayer";
import { useWishlist } from "@/hooks/useWishlist";
import { useGetWishlistQuery } from "@/state/features/whishlistApi";
import { useCart } from "@/hooks/useCart";
import DateRangeDialog from "@/components/clientComponents/dateInput";

interface GameProduct extends Product {
  reviews: Review[];
  uploadedVideo: VideoUploaded[];
  priceDetails: PriceDetails;
}

interface DetailHeroProps {
  product: GameProduct;
}

export default function DetailHero({ product }: DetailHeroProps) {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [rentalPeriod, setRentalPeriod] = useState(
    product.priceDetails.minimumRentalPeriod ?? 1
  );

  const [purchaseType, setPurchaseType] = useState<"rent" | "buy">("rent");

  const rating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      : 0;
  const reviewCount = product.reviews.length;

  useEffect(() => {
    setUrl(window.location.href);
  }, []);
  const { handleAddToCart } = useCart();

  const handleAddToCartBuy = () => {
    handleAddToCart(product, "SALE", 1);
  };

  const { data: wishlistData } = useGetWishlistQuery();

  // Check if the product is already in the wishlist
  const isInWishlist = wishlistData?.wishlist?.some(
    (item) => item.id === product.id
  );
  const { handleToggleWishlist } = useWishlist();
  const handleAddToWishlist = () => {
    handleToggleWishlist(product);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: "You can now share it anywhere.",
        variant: "default",
      });
    } catch (err) {
      console.error("Error copying link", err);
      toast({
        title: "Failed to Copy",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const calculateTotalPrice = (): number | undefined => {
    if (
      (purchaseType === "rent" && product.priceDetails.rentalPricePerDay) ??
      0 > 0
    ) {
      const basePrice =
        (product?.priceDetails?.rentalPricePerDay ?? 0) * (rentalPeriod ?? 1);
      return basePrice - basePrice * (product.discountPercentage / 100);
    } else if (product.priceDetails.salePrice ?? 0 > 0) {
      const basePrice = product.priceDetails.salePrice ?? 0;
      return basePrice - basePrice * (product.discountPercentage / 100);
    }
  };

  return (
    <div className="container px-4 sm:px-6 py-6 sm:py-8 mt-12 sm:mt-16 md:mt-24 lg:mt-[120px] min-h-screen bg-zinc-900 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Left Section */}
        <div className="flex flex-col gap-4 sm:gap-6 w-full">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <h1 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl font-serif tracking-tight">
              {product.productName}
            </h1>
            <Badge
              variant="outline"
              className="text-white border-white text-lg sm:text-xl font-mono"
            >
              {product.gameType}
            </Badge>
          </div>

          <div className="relative w-full aspect-[16/9] md:aspect-[4/3] rounded-lg overflow-hidden flex justify-center">
            <Image
              src={product.uploadedCoverImage || "/placeholder.svg"}
              alt={product.productName}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col items-center space-y-4 sm:space-y-6 w-full">
            {/* Star Rating */}
            {rating > 0 && (
              <div className="flex gap-4 font-semibold">
                <SingleStar rating={rating} />
                <span className="font-semibold text-xl font-sans">{`(${reviewCount} reviews)`}</span>
              </div>
            )}

            {/* Age Restriction Badge */}
            <div className="flex gap-3 sm:gap-6 items-center justify-center border-4 border-white p-3 sm:p-4 rounded-xl w-full max-w-xs">
              {
                <span className="font-black text-white text-center text-sm sm:text-lg font-mono tracking-wide">
                  AGE <br /> RESTRICTION
                </span>
              }
              <div className="flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-teal">
                <span className="text-white text-base sm:text-xl font-extrabold">
                  {product.ageRestriction === "All"
                    ? "None"
                    : product.ageRestriction}
                </span>
              </div>
            </div>

            {/* Rental Options */}
            <div className="w-full space-y-3 bg-zinc-800 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <div className="flex bg-zinc-700 rounded-lg p-1">
                  <button
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      purchaseType === "rent"
                        ? "bg-green-600 text-white"
                        : "text-zinc-300"
                    } font-sans`}
                    onClick={() => setPurchaseType("rent")}
                  >
                    Rent
                  </button>
                  <button
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      purchaseType === "buy"
                        ? "bg-green-600 text-white"
                        : "text-zinc-300"
                    } font-sans`}
                    onClick={() => setPurchaseType("buy")}
                  >
                    Buy
                  </button>
                </div>
                {product.discountPercentage && (
                  <Badge
                    variant="outline"
                    className="bg-green-600 text-white border-0 font-mono"
                  >
                    {product.discountPercentage}% OFF
                  </Badge>
                )}
              </div>
              {purchaseType === "rent" ? (
                (product.priceDetails.rentalPricePerDay ?? 0) > 0 ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium font-sans">
                        Rental Price:
                      </span>
                      <span className="text-green-500 font-bold font-serif">
                        <span className="text-sm line-through mr-2 text-red-500">
                          {formatPrice(
                            product.priceDetails.rentalPricePerDay ?? 0
                          )}
                          /Day
                        </span>
                        {formatPrice(
                          (product.priceDetails.rentalPricePerDay ?? 0) -
                            (product.priceDetails.rentalPricePerDay ?? 0) *
                              ((product.discountPercentage ?? 0) / 100)
                        )}
                        /Day
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-white font-sans">
                        Rental Period (Days):
                      </span>
                      <input
                        type="number"
                        min={
                          product.priceDetails.minimumRentalPeriod ?? undefined
                        }
                        max={
                          product.priceDetails.maximumRentalPeriod ?? undefined
                        }
                        value={rentalPeriod}
                        onChange={(e) =>
                          setRentalPeriod(
                            Math.min(
                              Math.max(
                                Number.parseInt(e.target.value) || 1,
                                product.priceDetails.minimumRentalPeriod ?? 1
                              ),
                              product.priceDetails.maximumRentalPeriod ?? 1
                            )
                          )
                        }
                        className="w-16 bg-zinc-700 text-white border border-zinc-600 rounded p-1 font-mono"
                      />
                    </div>
                  </>
                ) : (
                  <p className="text-red-600 text-sm font-sans">
                    This product is not available for rent
                  </p>
                )
              ) : product.priceDetails.salePrice ?? 0 > 0 ? (
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium font-sans">
                    Sale Price:
                  </span>
                  <span className="text-green-500 font-bold font-serif">
                    <span className="text-sm line-through text-red-500 mr-2">
                      {formatPrice(product.priceDetails.salePrice ?? 0)}
                    </span>
                    {formatPrice(
                      (product.priceDetails.salePrice ?? 0) -
                        ((product.priceDetails.salePrice ?? 0) *
                          product.discountPercentage) /
                          100
                    )}
                  </span>
                </div>
              ) : (
                <p className="text-red-600 text-sm font-sans">
                  This product is not available for sale
                </p>
              )}
              {calculateTotalPrice() && (
                <div className="flex justify-between items-center border-t border-zinc-700 pt-2 mt-2">
                  <span className="text-white font-medium font-sans">
                    Total:
                  </span>
                  <span className="text-green-500 font-bold font-serif">
                    {calculateTotalPrice() !== undefined &&
                      formatPrice(calculateTotalPrice() ?? 0)}
                  </span>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="w-full space-y-3">
              {(purchaseType === "rent" &&
                product.priceDetails.rentalPricePerDay) ??
              0 > 0 ? (
                <DateRangeDialog product={product} />
              ) : (purchaseType === "buy" && product.priceDetails.salePrice) ??
                0 > 0 ? (
                <Button
                  className="flex items-center gap-2 bg-green-600 px-4 py-2 hover:bg-green-700 w-full h-10 sm:h-12 text-sm sm:text-base font-sans tracking-wide"
                  onClick={handleAddToCartBuy}
                >
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  <span className="text-white">Save to Buy</span>
                </Button>
              ) : null}

              <Button
                className="flex items-center gap-2 border-2 border-green-600 px-4 py-2 w-full h-10 sm:h-12 text-sm sm:text-base bg-transparent hover:bg-gray-700 font-sans tracking-wide"
                onClick={handleAddToWishlist}
              >
                <Heart
                  className={`h-4 w-4 sm:h-5 sm:w-5 text-white  ${
                    isInWishlist
                      ? "fill-red-500 text-red-500"
                      : "text-gray-700 hover:text-red-500"
                  }`}
                />
                <span className="text-white">Add to Wishlist</span>
              </Button>

              <div className="flex flex-col w-full space-y-2 mt-2">
                <div className="flex justify-between items-center px-4 py-2 border-b border-zinc-700 text-sm sm:text-base">
                  <span className="text-white font-sans">
                    Available for Rent
                  </span>
                  <span className="text-white font-semibold font-mono">
                    {product.availableForRent > 0
                      ? product.availableForRent
                      : "Out of Stock"}
                  </span>
                </div>
                <div className="flex justify-between items-center px-4 py-2 border-b-2 border-green-600 text-sm sm:text-base">
                  <span className="text-white font-sans">
                    Available for Sale
                  </span>
                  <span className="text-white font-semibold font-mono">
                    {product.availableForSale > 0
                      ? product.availableForSale
                      : "Out of Stock"}
                  </span>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-zinc-800"
                  onClick={copyLink}
                >
                  <Share2 className="text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-span-1 md:col-span-2 text-white flex flex-col items-center p-3 sm:p-6 rounded-lg bg-zinc-800">
          <div className="w-full max-w-4xl">
            <div className="flex items-center mb-4 sm:mb-6">
              <Info className="text-red-500 mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <p className="text-xs sm:text-sm font-sans italic">
                Click The Buttons Below For More Info
              </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="setup" className="mb-4 sm:mb-6 w-full">
              <TabsList className="flex gap-2 sm:gap-4 justify-between bg-transparent w-full mb-3 sm:mb-4 overflow-hidden">
                <TabsTrigger
                  value="setup"
                  className="bg-zinc-700 hover:bg-zinc-600 data-[state=active]:bg-green-600 rounded-xl py-2 sm:py-5 text-xs sm:text-sm md:text-base flex-1 min-w-[50px] font-sans tracking-wide"
                >
                  Set Up
                </TabsTrigger>
                <TabsTrigger
                  value="action-cards"
                  className="bg-zinc-700 hover:bg-zinc-600 data-[state=active]:bg-green-600 rounded-xl py-2 sm:py-3 text-xs sm:text-sm md:text-base flex-1 min-w-[80px] font-sans tracking-wide"
                >
                  Action Cards
                </TabsTrigger>
                <TabsTrigger
                  value="gameplay"
                  className="bg-zinc-700 hover:bg-zinc-600 data-[state=active]:bg-green-600 rounded-xl py-2 sm:py-3 text-xs sm:text-sm md:text-base flex-1 min-w-[80px] font-sans tracking-wide"
                >
                  Gameplay
                </TabsTrigger>
              </TabsList>

              <TabsContent value="setup" className="mt-3 sm:mt-4">
                <EnhancedVideoPlayer
                  videoSrc={
                    product.uploadedVideo[0].setUp ||
                    "https://youtu.be/2bEUB0Bervg?si=wfc-H1_IC9YcvN1e"
                  }
                  posterSrc={product.uploadedCoverImage}
                  title={`How to Set Up ${product.productName}`}
                />
              </TabsContent>

              <TabsContent value="action-cards" className="mt-3 sm:mt-4">
                <EnhancedVideoPlayer
                  videoSrc={
                    product.uploadedVideo[0].actionCard ||
                    "https://youtu.be/2bEUB0Bervg?si=wfc-H1_IC9YcvN1e"
                  }
                  posterSrc={product.uploadedCoverImage}
                  title={`${product.productName} Action Cards Explained`}
                />
              </TabsContent>

              <TabsContent value="gameplay" className="mt-3 sm:mt-4">
                <EnhancedVideoPlayer
                  videoSrc={
                    product.uploadedVideo[0].gamePlay ||
                    "https://youtu.be/2bEUB0Bervg?si=wfc-H1_IC9YcvN1e"
                  }
                  posterSrc={product.uploadedCoverImage}
                  title={`${product.productName} Gameplay Rules`}
                />
              </TabsContent>
            </Tabs>

            <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 text-zinc-300">
              <h2 className="text-lg sm:text-xl font-semibold text-white font-serif">
                About {product.productName}
              </h2>
              <p className="text-sm sm:text-base font-sans leading-relaxed">
                {product.productDescription}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {/* Rental Details */}
                {(product.priceDetails.rentalPricePerDay ?? 0) > 0 && (
                  <div className="bg-zinc-700 p-4 rounded-lg">
                    <h3 className="text-white font-medium mb-2 flex items-center font-serif">
                      <Clock className="w-4 h-4 mr-2" />
                      Rental Details
                    </h3>
                    <ul className="space-y-2 text-sm font-sans">
                      <li className="flex justify-between">
                        <span>Minimum Period:</span>
                        <span className="font-mono">
                          {product.priceDetails.minimumRentalPeriod} Day(s)
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span>Maximum Period:</span>
                        <span className="font-mono">
                          {product.priceDetails.maximumRentalPeriod} Day(s)
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span>Price Per Day:</span>
                        <span className="font-serif">
                          {formatPrice(
                            (product.priceDetails.rentalPricePerDay ?? 0) -
                              (product.priceDetails.rentalPricePerDay ?? 0) *
                                ((product.discountPercentage ?? 0) / 100)
                          )}
                        </span>
                      </li>
                    </ul>
                  </div>
                )}

                {/* Sale Details */}
                {product.priceDetails.salePrice !== null &&
                  product.priceDetails.salePrice > 0 && (
                    <div className="bg-zinc-700 p-4 rounded-lg">
                      <h3 className="text-white font-medium mb-2 font-serif">
                        Sale Details
                      </h3>
                      <ul className="space-y-2 text-sm font-sans">
                        <li className="flex justify-between">
                          <span>Sale Price:</span>
                          <span className="font-serif">
                            {formatPrice(
                              (product.priceDetails.salePrice ?? 0) -
                                ((product.priceDetails.salePrice ?? 0) *
                                  (product.discountPercentage ?? 0)) /
                                  100
                            )}
                          </span>
                        </li>
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
