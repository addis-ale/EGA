import { useState } from "react";
import TrendingCard from "../productCards/trendingCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PriceDetails, Product, Review, VideoUploaded } from "@prisma/client";

interface TrendingProps {
  trending: (Product & {
    priceDetails: PriceDetails;
    videoUploaded: VideoUploaded;
    reviews: Review[];
  })[];
  setPage: (page: number) => void;
  totalPages: number;
}

const Trending = ({ trending, setPage, totalPages }: TrendingProps) => {
  const [page, setLocalPage] = useState(1);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setLocalPage(newPage);
      setPage(newPage);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-12 px-4">
      {/* Header with Pagination Controls */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Trending</h1>
        <div className="font-semibold text-white flex items-center gap-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            className="disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span>
            {page}/{totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            className="disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Products Grid - Responsive */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center ${
          trending?.length < 3 ? "justify-center" : ""
        }`}
      >
        {trending.length &&
          trending.map((item) => <TrendingCard key={item.id} product={item} />)}
      </div>
    </div>
  );
};

export default Trending;
