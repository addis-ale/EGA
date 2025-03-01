import type React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TrendingSkeletonProps {
  limit: number;
}

const TrendingSkeleton: React.FC<TrendingSkeletonProps> = ({ limit }) => {
  return (
    <div className="w-full my-8">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(limit)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="flex flex-col gap-3">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-between items-center mt-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
          ))}
      </div>

      <div className="flex justify-center mt-8 gap-2">
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-md" />
      </div>
    </div>
  );
};

export default TrendingSkeleton;
