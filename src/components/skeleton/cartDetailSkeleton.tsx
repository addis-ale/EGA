"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function CartDetailSkeleton() {
  return (
    <div className="w-full mt-[60px]">
      <div className="mx-auto py-8 px-4">
        <Skeleton className="h-8 w-40 mb-6" />

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Cart Items List Skeleton */}
          <div className="w-full sm:w-2/3 space-y-4">
            {/* Repeat cart item skeletons */}
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-zinc-900 rounded-lg p-4 flex flex-col sm:flex-row gap-4"
              >
                {/* Product Image Skeleton */}
                <div className="flex-shrink-0">
                  <Skeleton className="w-[100px] h-[100px] rounded-md" />
                </div>

                {/* Product Details Skeleton */}
                <div className="flex-grow space-y-4 w-full">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 w-2/3">
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>

                    {/* Quantity Controls Skeleton */}
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-6 h-6 rounded-md" />
                      <Skeleton className="w-4 h-6" />
                      <Skeleton className="w-6 h-6 rounded-md" />
                    </div>
                  </div>

                  {/* Price and Actions Skeleton */}
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-20" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-32" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Skeleton */}
          <div className="w-full sm:w-1/3 bg-zinc-900 rounded-lg p-4 h-fit">
            <Skeleton className="h-6 w-32 mb-6" />

            <div className="space-y-4">
              {/* Order Items Skeleton */}
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <Skeleton className="w-12 h-12 rounded" />
                  <div className="flex-grow">
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              ))}

              {/* Discount Code and Totals Skeleton */}
              <div className="pt-2">
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-10 flex-grow" />
                  <Skeleton className="h-10 w-20" />
                </div>

                {/* Price Summary Skeleton */}
                <div className="pt-4 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-3 w-40" />

                  {/* Checkout Button Skeleton */}
                  <Skeleton className="h-14 w-full mt-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
