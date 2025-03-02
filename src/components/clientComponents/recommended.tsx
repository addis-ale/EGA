"use client";

import type { Product } from "@prisma/client";
import { RecommendedCard } from "../productCards/recommendedCard";
import { RecommendedCardSkeleton } from "../productCards/recommendedSkeleton";
import { MiniFavorite } from "./miniFavorite";
import { useRemoveFromWishlist } from "@/hooks/useRemoveWishlit";

interface RecommendedProps {
  recommended: Product[];
  localWishList: Product[];
  loading: boolean;
  setLocalWishList: React.Dispatch<React.SetStateAction<Product[]>>;
}

const Recommended = ({
  recommended,
  localWishList,
  loading,
  setLocalWishList,
}: RecommendedProps) => {
  const { handleRemoveFromWishlist } = useRemoveFromWishlist(
    localWishList,
    setLocalWishList
  );
  // Check if the wishlist is not null and contains items
  const hasFavorites = localWishList && localWishList?.length > 0;

  return (
    <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-8 px-4 lg:px-0 w-full">
      {/* Left Section: Recommendations */}
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
              <RecommendedCard key={item.id} product={item} />
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
            <MiniFavorite
              wishlist={localWishList}
              onRemove={handleRemoveFromWishlist}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommended;
