import { useState, useEffect } from "react";
import { Product } from "@prisma/client";
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

  return (
    <div className="flex items-start justify-between gap-8 px-4 lg:px-0">
      {/* Left Section: Recommendations (Flexible width) */}
      <div className="flex-1">
        <h1 className="text-white font-bold text-3xl mb-6">Recommendation</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <RecommendedCardSkeleton key={index} />
            ))
          ) : recommended && recommended.length > 0 ? (
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
            <p>No recommendations available.</p>
          )}
        </div>
      </div>

      {/* Right Section: MiniFavorite (Fixed Position on Right) */}
      <div className="hidden md:block w-64 min-w-[200px]">
        <MiniFavorite games={sampleGames} />
      </div>
    </div>
  );
};

export default Recommended;
