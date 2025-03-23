import { Skeleton } from "@/components/ui/skeleton";
import TrendingCardSkeleton from "./cardSkeleton";

const TrendingSkeleton = () => {
  // Create an array of 6 items to represent loading cards
  const skeletonCards = Array(6).fill(null);

  return (
    <div className="flex flex-col gap-6 py-12 px-4">
      {/* Header with Pagination Controls - All as skeletons */}
      <div className="flex justify-between items-center">
        {/* "Trending" text as skeleton */}
        <Skeleton className="h-10 w-36 bg-gray-700" />

        {/* Pagination controls as skeletons */}
        <div className="flex items-center gap-2">
          {/* Left arrow button */}
          <Skeleton className="h-8 w-8 rounded-md bg-gray-700" />

          {/* Page counter */}
          <Skeleton className="h-6 w-12 bg-gray-700" />

          {/* Right arrow button */}
          <Skeleton className="h-8 w-8 rounded-md bg-gray-700" />
        </div>
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

export default TrendingSkeleton;
