import { Skeleton } from "@/components/ui/skeleton";
import TrendingCardSkeleton from "./cardSkeleton";

const TopRatedSkeleton = () => {
  // Create an array of 6 items to represent loading cards
  const skeletonCards = Array(6).fill(null);

  return (
    <div className="flex flex-col gap-6 py-12 px-4">
      {/* Header with Pagination Controls - All as skeletons */}
      <div className="flex justify-between items-center">
        {/* "Trending" text as skeleton */}
        <Skeleton className="h-10 w-36 bg-gray-700" />
      </div>

      {/* Products Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
        {skeletonCards.map((_, index) => (
          <TrendingCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default TopRatedSkeleton;
