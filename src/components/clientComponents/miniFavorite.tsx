"use client";

import { Heart } from "lucide-react";
import { MiniFavoriteCard } from "../productCards/miniFavoriteCard";
import { MiniFavoriteCardSkeleton } from "../productCards/miniFavoriteCardSkeleton";
import { Product } from "@prisma/client";

interface FavoritesListProps {
  wishlist: Product[];
  isLoading?: boolean;
  onRemove: (productId: string) => void;
}

export function MiniFavorite({
  wishlist,
  isLoading = false,
  onRemove,
}: FavoritesListProps) {
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
            wishlist.map((product) => (
              <MiniFavoriteCard
                key={product.id}
                product={product}
                onRemove={onRemove}
              />
            ))}
      </div>
    </div>
  );
}
