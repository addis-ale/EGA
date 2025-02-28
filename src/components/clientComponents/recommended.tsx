"use client";

import { useState, useEffect } from "react";
import type { Product } from "@prisma/client";
import { RecommendedCard } from "../productCards/recommendedCard";
import { RecommendedCardSkeleton } from "../productCards/recommendedSkeleton";
import { MiniFavorite } from "./miniFavorite";
import { truncateText } from "@/utils/helper";

interface RecommendedProps {
  recommended: Product[] | null; // Make it nullable in case of failure
}

interface Game {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  hasAddToCart?: boolean;
}

const Recommended = ({ recommended }: RecommendedProps) => {
  const [loading, setLoading] = useState(true);

  // Example sample games data
  const sampleGames: Game[] = [
    {
      id: "1",
      name: "Jenga",
      category: "Table Top Games",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fav-jF7AfzuzZV0WnLy9OzIMEi6N6t5gqU.png",
      hasAddToCart: true,
    },
    {
      id: "2",
      name: "UNO",
      category: "Table Top Games",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fav-jF7AfzuzZV0WnLy9OzIMEi6N6t5gqU.png",
      hasAddToCart: false,
    },
    {
      id: "3",
      name: "Dart",
      category: "Table Top Games",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fav-jF7AfzuzZV0WnLy9OzIMEi6N6t5gqU.png",
      hasAddToCart: false,
    },
    {
      id: "4",
      name: "Jackaroo",
      category: "Table Top Games",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fav-jF7AfzuzZV0WnLy9OzIMEi6N6t5gqU.png",
      hasAddToCart: true,
    },
    {
      id: "5",
      name: "CHESS",
      category: "Table Top Games",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fav-jF7AfzuzZV0WnLy9OzIMEi6N6t5gqU.png",
      hasAddToCart: false,
    },
    {
      id: "6",
      name: "Jenga",
      category: "Table Top Games",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fav-jF7AfzuzZV0WnLy9OzIMEi6N6t5gqU.png",
      hasAddToCart: false,
    },
    {
      id: "7",
      name: "Jackaroo",
      category: "Table Top Games",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fav-jF7AfzuzZV0WnLy9OzIMEi6N6t5gqU.png",
      hasAddToCart: true,
    },
  ];

  useEffect(() => {
    if (recommended) {
      setLoading(false);
    }
  }, [recommended]);

  // Check if favorites are empty
  const hasFavorites = sampleGames && sampleGames.length > 0;

  return (
    <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-8 px-4 lg:px-0 w-full">
      {/* Left Section: Recommendations (Flexible width) */}
      <div className="w-full lg:flex-1 flex flex-col">
        <h1 className="text-white font-bold text-2xl md:text-3xl mb-4 md:mb-6">
          Recommendation
        </h1>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 md:gap-3">
          {loading ? (
            // Render skeletons dynamically based on the length of the recommended array
            Array.from({ length: recommended?.length || 5 }).map((_, index) => (
              <div key={index} className="h-full w-full">
                <RecommendedCardSkeleton />
              </div>
            ))
          ) : recommended && recommended.length > 0 ? (
            // Render recommended cards when data is loaded
            recommended.map((item) => (
              <RecommendedCard
                key={item.id}
                image={item.uploadedCoverImage}
                originalPrice={item.price}
                discountPercentage={item.discountPercentage}
                name={truncateText(item.productName)}
                type={item.gameType}
              />
            ))
          ) : (
            <p className="text-white">No recommendations available.</p>
          )}
        </div>
      </div>

      {/* Right Section: MiniFavorite (Only show if there are favorites) */}
      {hasFavorites && (
        <div className="hidden lg:block w-64 min-w-[200px] max-h-[800px] overflow-y-auto scrollbar-hide">
          <div className="h-full flex flex-col">
            <MiniFavorite games={sampleGames} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommended;
