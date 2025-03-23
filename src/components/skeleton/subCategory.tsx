import { Skeleton } from "@/components/ui/skeleton";
import TrendingCardSkeleton from "./cardSkeleton";

export default function SubCategoryLoading() {
  // Create an array of 8 items to represent loading products
  const skeletonItems = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Subcategory selector skeleton */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <Skeleton className="h-10 w-20 rounded-full" />
          <Skeleton className="h-10 w-20 rounded-full" />
          <Skeleton className="h-10 w-20 rounded-full" />
          <Skeleton className="h-10 w-20 rounded-full" />
          <Skeleton className="h-10 w-20 rounded-full" />
        </div>
      </div>

      {/* Product grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {skeletonItems.map((_, index) => (
          <TrendingCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
