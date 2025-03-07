import type React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductListingCardSkeleton from "../clientComponents/productCardSkeleton";

interface TrendingSkeletonProps {
  count?: number;
}

const TrendingSkeleton: React.FC<TrendingSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="flex flex-col gap-6 py-12 px-4">
      {/* Header with Pagination Controls */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Trending</h1>
        <div className="font-semibold text-white flex items-center gap-2">
          <button className="disabled:opacity-50">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span>1/1</span>
          <button className="disabled:opacity-50">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Products Grid - Responsive */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center ${
          count < 3 ? "justify-center" : ""
        }`}
      >
        {[...Array(count)].map((_, index) => (
          <ProductListingCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default TrendingSkeleton;
