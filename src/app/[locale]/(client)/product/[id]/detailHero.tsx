"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Share2, ShoppingCart, Play, Info } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import StarRating from "@/components/starRation";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@prisma/client";
import { useAddToCartMutation } from "@/state/features/cartApi";
import { useAddToWishlistMutation } from "@/state/features/whishlistApi";
interface DetailedHeroProps {
  product: Product;
}
export default function DetailHero({ product }: DetailedHeroProps) {
  const [addCartItem] = useAddToCartMutation();
  const [addToWishlist] = useAddToWishlistMutation();
  const handleAddTocart = () => {
    if (product && product.id) {
      addCartItem({ productId: product.id, quantity: 1 })
        .unwrap()
        .then(() => {
          toast({
            title: "Product added to cart",
            description: `${product.productName} has been added to your cart.`,
            className: "bg-teal text-white",
          });
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: "Failed to add to cart",
            description: "Something went wrong.",
            variant: "destructive",
          });
        });
    }
  };
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);

      toast({
        title: "Link Copied!",
        description: "You can now share it anywhere.",
        className: "bg-teal text-white",
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

  return (
    <div className="container px-4 sm:px-6 py-6 sm:py-8 mt-12 sm:mt-16 md:mt-24 lg:mt-[120px] min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Left Section */}
        <div className="flex flex-col gap-4 sm:gap-6 w-full">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <h1 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl">
              {product.productName}
            </h1>
            <h3 className="text-white text-lg sm:text-xl md:text-2xl">
              {product.gameType}
            </h3>
          </div>

          <div className="relative w-full aspect-[16/9] md:aspect-[4/3] rounded-lg overflow-hidden flex justify-center">
            <Image
              src={product.uploadedCoverImage}
              alt={product.productName}
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="flex flex-col items-center space-y-4 sm:space-y-6 w-full">
            {/* Star Rating 
            //TODO: make the star dynamic
            
            */}
            <StarRating initialRating={4.7} />

            {/* Adult Only Badge */}
            <div className="flex gap-3 sm:gap-6 items-center justify-center border-4 border-white p-3 sm:p-4 rounded-xl w-full max-w-xs">
              <span className="font-extrabold text-white text-center text-sm sm:text-lg">
                ADULT <br /> ONLY
              </span>
              <div className="flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-gray-700">
                <span className="text-white text-base sm:text-xl font-extrabold">
                  {product.ageRestriction}+
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="w-full space-y-3">
              <Button
                className="flex items-center gap-2 bg-green-600 px-4 py-2 hover:bg-green-700 w-full h-10 sm:h-12 text-sm sm:text-base"
                onClick={handleAddTocart}
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                <span className="text-white">Add to cart</span>
              </Button>

              <Button
                className="flex items-center gap-2 border-2 border-green-600 px-4 py-2 w-full h-10 sm:h-12 text-sm sm:text-base bg-transparent hover:bg-gray-700"
                onClick={() => addToWishlist({ productId: product.id })}
              >
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                <span className="text-white">In wishlist</span>
              </Button>

              <div className="flex justify-between items-center px-4 py-2 border-b-2 border-teal text-sm sm:text-base">
                <span className="text-white">Amount Available</span>
                <span className="text-white font-semibold">
                  {product.availableProduct}
                </span>
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
        <div className="col-span-1 md:col-span-2 text-white flex flex-col items-center p-3 sm:p-6 rounded-lg">
          <div className="w-full max-w-4xl">
            <div className="flex items-center mb-4 sm:mb-6">
              <Info className="text-red-500 mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <p className="text-xs sm:text-sm">
                Click The Buttons Below For More Info
              </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="setup" className="mb-4 sm:mb-6 w-full">
              <TabsList className="flex gap-2 sm:gap-4 justify-between bg-transparent w-full mb-3 sm:mb-4 overflow-x-auto">
                <TabsTrigger
                  value="setup"
                  className="bg-zinc-700 hover:bg-zinc-600 data-[state=active]:bg-zinc-600 rounded-md py-2 sm:py-3 text-xs sm:text-sm md:text-base flex-1 min-w-[80px]"
                >
                  Set Up
                </TabsTrigger>
                <TabsTrigger
                  value="action-cards"
                  className="bg-zinc-700 hover:bg-zinc-600 data-[state=active]:bg-zinc-600 rounded-md py-2 sm:py-3 text-xs sm:text-sm md:text-base flex-1 min-w-[80px]"
                >
                  Action Cards
                </TabsTrigger>
                <TabsTrigger
                  value="gameplay"
                  className="bg-zinc-700 hover:bg-zinc-600 data-[state=active]:bg-zinc-600 rounded-md py-2 sm:py-3 text-xs sm:text-sm md:text-base flex-1 min-w-[80px]"
                >
                  Gameplay
                </TabsTrigger>
              </TabsList>

              <TabsContent value="setup" className="mt-3 sm:mt-4">
                <EnhancedVideoPlayer
                  videoSrc="/videos/uno-setup.mp4"
                  posterSrc="/imageAssets/uno-setup-poster.jpg"
                  title="How to Set Up UNO"
                />
              </TabsContent>

              <TabsContent value="action-cards" className="mt-3 sm:mt-4">
                <EnhancedVideoPlayer
                  videoSrc="/videos/uno-action-cards.mp4"
                  posterSrc="/imageAssets/uno-action-cards-poster.jpg"
                  title="UNO Action Cards Explained"
                />
              </TabsContent>

              <TabsContent value="gameplay" className="mt-3 sm:mt-4">
                <EnhancedVideoPlayer
                  videoSrc="/videos/uno-gameplay.mp4"
                  posterSrc="/imageAssets/uno-gameplay-poster.jpg"
                  title="UNO Gameplay Rules"
                />
              </TabsContent>
            </Tabs>

            <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 text-zinc-300">
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                About {product.productName}
              </h2>
              <p className="text-sm sm:text-base">
                {product.productDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Video Player Component with actual video functionality
interface EnhancedVideoPlayerProps {
  videoSrc: string;
  posterSrc?: string;
  title?: string;
}

function EnhancedVideoPlayer({
  videoSrc,
  posterSrc,
  title,
}: EnhancedVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      // Handle the play promise to catch any errors
      const playPromise = videoRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch((error) => {
            // Handle the AbortError or any other errors
            console.log("Video play error:", error);
            setIsPlaying(false);
            setIsLoading(false);
          });
      }
    }
  };

  // Clean up when component unmounts
  useEffect(() => {
    const videoElement = videoRef.current;
    return () => {
      if (videoElement && !videoElement.paused) {
        videoElement.pause();
      }
    };
  }, []);

  // Handle tab switching - pause video when tab content changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="space-y-2 sm:space-y-3">
      {title && (
        <h3 className="text-base sm:text-lg font-medium text-white">{title}</h3>
      )}

      <Card className="relative aspect-video bg-zinc-800 rounded-lg overflow-hidden border-0 w-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={posterSrc || "/placeholder.svg?height=720&width=1280"}
          controls={isPlaying}
          onEnded={() => setIsPlaying(false)}
          preload="metadata"
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {!isPlaying && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer"
            onClick={togglePlay}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center transition-transform transform hover:scale-110">
              {isLoading ? (
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-zinc-800 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Play className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 text-zinc-800 ml-1" />
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
