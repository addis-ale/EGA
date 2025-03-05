import { Skeleton } from "@/components/ui/skeleton";

const ProductCarouselSkeleton = () => {
  return (
    <div className="w-full text-white py-6">
      {/* Title Skeleton */}
      <div className="text-start mb-6">
        <Skeleton className="h-8 w-48 md:w-64" />
      </div>

      {/* Carousel Skeleton */}
      <div className="w-full flex gap-4 overflow-hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square relative overflow-hidden rounded-lg border border-zinc-800 w-1/3"
          >
            <Skeleton className="h-full w-full" />
          </div>
        ))}
      </div>

      {/* Product Name & Button Skeleton */}
      <div className="flex flex-col justify-center items-center gap-2 py-6">
        <Skeleton className="h-6 w-40 md:w-56" />
        <Skeleton className="h-4 w-24 mt-2" />
        <Skeleton className="h-10 w-40 mt-2 rounded-md" />
      </div>
    </div>
  );
};

export default ProductCarouselSkeleton;
