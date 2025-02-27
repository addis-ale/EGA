"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { MiniFavoriteCard } from "../productCards/miniFavoriteCard";
import { MiniFavoriteCardSkeleton } from "../productCards/miniFavoriteCardSkeleton";
import { truncateText } from "@/utils/helper";

interface Game {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  hasAddToCart?: boolean;
}

interface FavoritesListProps {
  games?: Game[];
  isLoading?: boolean;
}

export function MiniFavorite({ games, isLoading = false }: FavoritesListProps) {
  // Sample data for demonstration
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

  const [favoriteGames, setFavoriteGames] = useState(games || sampleGames);

  const handleRemove = (id: string) => {
    setFavoriteGames(favoriteGames.filter((game) => game.id !== id));
  };

  return (
    <div className="w-full max-w-md rounded-xl bg-oliveGreen p-4 flex flex-col justify-center">
      <div className="mb-4 flex items-center justify-center">
        <Heart className="mr-2 h-5 w-5 text-white" fill="none" />
        <h2 className="text-lg font-semibold text-white ">Favourite list</h2>
      </div>

      <div className="space-y-2">
        {isLoading
          ? // Skeleton loading state
            Array.from({ length: 5 }).map((_, index) => (
              <MiniFavoriteCardSkeleton key={index} />
            ))
          : // Actual content
            favoriteGames.map((game) => (
              <MiniFavoriteCard
                key={game.id}
                id={game.id}
                name={truncateText(game.name)}
                category={game.category}
                imageUrl={game.imageUrl}
                hasAddToCart={game.hasAddToCart}
                onRemove={handleRemove}
              />
            ))}
      </div>
    </div>
  );
}
