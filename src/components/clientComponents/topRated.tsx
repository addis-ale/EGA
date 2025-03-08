"use client";

import type {
  PriceDetails,
  Product,
  Review,
  VideoUploaded,
} from "@prisma/client";

import ProductListingCard from "../productCards/trendingCard";
import ProductListingCardSkeleton from "./productCardSkeleton";
import { SingleStar } from "../singleStar";
interface RecommendedProps {
  recommended: (Product & {
    priceDetails: PriceDetails;
    videoUploaded: VideoUploaded;
    reviews: Review[];
  })[];
}

const TopRated = ({ recommended }: RecommendedProps) => {
  return (
    <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-8 px-4 lg:px-0 w-full">
      {/* Left Section: Recommendations */}
      <div className="w-full lg:flex-1 flex flex-col">
        <div className="flex gap-2 items-center mb-4 md:mb-6">
          <SingleStar />
          <h1 className="text-white font-bold text-2xl md:text-3xl ">
            Top Rated
          </h1>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3   gap-2 md:gap-3">
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
            <p className="text-white">No Product rated yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopRated;
