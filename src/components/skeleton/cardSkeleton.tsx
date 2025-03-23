import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const TrendingCardSkeleton = () => {
  return (
    <Card className="w-full overflow-hidden rounded-xl border shadow-md border-teal bg-gray-800">
      {/* Image section with placeholder */}
      <div className="relative h-48 w-full sm:h-56 md:h-64 lg:h-52 xl:h-56 overflow-hidden bg-gray-700">
        <Skeleton className="h-full w-full bg-gray-700" />

        {/* Wishlist button placeholder */}
        <div className="absolute right-3 top-1">
          <Skeleton className="h-9 w-9 rounded-full bg-gray-600" />
        </div>
      </div>

      {/* Content section */}
      <div className="p-4 bg-gray-800">
        {/* Category */}
        <Skeleton className="h-4 w-24 mb-1 bg-gray-700" />

        {/* Product name and badges */}
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-8 w-3/5 bg-gray-700" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-16 rounded-full bg-gray-700" />
          </div>
        </div>

        {/* Ratings */}
        <div className="flex items-center mt-1 mb-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-4 bg-gray-700" />
            ))}
          </div>
          <Skeleton className="h-4 w-8 ml-2 bg-gray-700" />
        </div>

        {/* Price information */}
        <div className="flex flex-wrap items-center gap-2 mt-2 mb-4">
          <Skeleton className="h-6 w-20 bg-gray-700" />
          <Skeleton className="h-5 w-16 ml-auto rounded-full bg-gray-700" />
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Skeleton className="h-9 w-full bg-gray-700" />
          <Skeleton className="h-9 w-full bg-gray-700" />
        </div>
      </div>
    </Card>
  );
};
export default TrendingCardSkeleton;
