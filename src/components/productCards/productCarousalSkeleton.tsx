"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function ProductCarouselSkeleton() {
  return (
    <div className="w-full bg-black text-white">
      {/* Carousel Skeleton */}
      <Card className="w-full max-w-5xl mx-auto bg-gray-900 border-none shadow-lg">
        <CardContent className="p-6">
          <div className="flex gap-4 overflow-hidden">
            {[...Array(3)].map((_, index) => (
              <Skeleton
                key={index}
                className="w-1/3 aspect-square rounded-lg bg-gray-800"
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Product Info Skeleton */}
      <div className="text-center py-4">
        <Skeleton className="h-6 w-48 mx-auto bg-gray-700" />
        <Skeleton className="h-4 w-24 mx-auto mt-2 bg-gray-600" />
        <Skeleton className="h-10 w-40 mx-auto mt-4 rounded-lg bg-green-700" />
      </div>
    </div>
  );
}
