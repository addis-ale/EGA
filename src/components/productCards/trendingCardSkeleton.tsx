import { Skeleton } from "@/components/ui/skeleton";
import SkeletonCard from "../clientComponents/trendigSkeletonCard";

const TrendingSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 py-12 px-4">
      {/* Header with Pagination Controls Skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-10" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>

      {/* Dynamic Grid of Skeleton Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default TrendingSkeleton;
