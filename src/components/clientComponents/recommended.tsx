"use client";

import type {
  PriceDetails,
  Product,
  Review,
  VideoUploaded,
} from "@prisma/client";

import ProductListingCard from "../productCards/trendingCard";
import ProductListingCardSkeleton from "./productCardSkeleton";
interface RecommendedProps {
  recommended: (Product & {
    priceDetails: PriceDetails;
    videoUploaded: VideoUploaded;
    reviews: Review[];
  })[];
}

const Recommended = ({ recommended }: RecommendedProps) => {
  return (
    <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-8 px-4 lg:px-0 w-full">
      {/* Left Section: Recommendations */}
      <div className="w-full lg:flex-1 flex flex-col">
        <h1 className="text-white font-bold text-2xl md:text-3xl mb-4 md:mb-6">
          Recommendation
        </h1>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4  xl:grid-cols-4  gap-2 md:gap-3">
          {false ? (
            // Render skeletons dynamically based on the length of the recommended array
            Array.from({ length: recommended?.length || 5 }).map((_, index) => (
              <div key={index} className="h-full w-full">
                <ProductListingCardSkeleton />
              </div>
            ))
          ) : recommended && recommended.length > 0 ? (
            // Render recommended cards when data is loaded
            recommended.map((item) => (
              <ProductListingCard key={item.id} product={item} />
            ))
          ) : (
            <p className="text-white">No recommendations available.</p>
          )}
        </div>
      </div>
      {/* 
      {hasFavorites && (
        <div className="hidden lg:block w-64 min-w-[200px] max-h-[800px] overflow-y-auto scrollbar-hide">
          <div className="h-full flex flex-col">
            <MiniFavorite />
          </div>
        </div>
      )}
       */}
    </div>
  );
};

export default Recommended;
