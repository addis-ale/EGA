import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductListingCardSkeleton() {
  return (
    <Card className="w-full max-w-md overflow-hidden rounded-xl border shadow-md bg-gray-500">
      {/* Image Skeleton */}
      <div className="relative h-64 w-full sm:h-72 overflow-hidden bg-gray-800">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content Skeleton */}
      <div className="p-4">
        {/* Category */}
        <Skeleton className="h-4 w-1/4 mb-2" />

        {/* Product Name */}
        <Skeleton className="h-6 w-3/4 mb-3" />

        {/* Ratings */}
        <div className="flex items-center mt-1 mb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-8 ml-2" />
        </div>

        {/* Price Section */}
        <div className="flex flex-wrap items-center gap-2 mt-2 mb-4">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-5 w-1/6" />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </Card>
  );
}
