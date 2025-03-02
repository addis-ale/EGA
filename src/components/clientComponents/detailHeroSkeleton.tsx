import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function DetailHeroSkeleton() {
  return (
    <div className="container px-4 py-6 mt-12 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="flex flex-col gap-4 w-full">
          {/* Product Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-6 w-[150px]" />
          </div>

          {/* Product Image Skeleton */}
          <Skeleton className="w-full aspect-[16/9] rounded-lg" />

          {/* Rating Skeleton */}
          <div className="flex justify-center">
            <Skeleton className="h-6 w-[150px]" />
          </div>

          {/* Age Restriction Badge Skeleton */}
          <div className="flex gap-3 items-center justify-center border-2 border-muted p-3 rounded-xl w-full max-w-xs mx-auto">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>

          {/* Action Buttons Skeleton */}
          <div className="w-full space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />

            {/* Product Availability Skeleton */}
            <div className="flex justify-between items-center px-4 py-2 border-b border-muted">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>

            {/* Share Button Skeleton */}
            <div className="flex justify-end">
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-span-1 md:col-span-2 flex flex-col items-center p-3 rounded-lg">
          <div className="w-full max-w-4xl space-y-6">
            {/* Info Header Skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-48" />
            </div>

            {/* Tabs Skeleton */}
            <div className="space-y-4">
              {/* Tab Buttons */}
              <div className="flex gap-2">
                {[1, 2, 3].map((tab) => (
                  <Skeleton key={tab} className="h-10 flex-1" />
                ))}
              </div>

              {/* Video Player Skeleton */}
              <Card className="w-full">
                <Skeleton className="w-full aspect-video rounded-lg" />
              </Card>

              {/* Video Title Skeleton */}
              <Skeleton className="h-6 w-48" />
            </div>

            {/* Product Description Skeleton */}
            <div className="space-y-4 mt-6">
              <Skeleton className="h-8 w-64" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[95%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
