import { Skeleton } from "../ui/skeleton";

const SkeletonCard = () => {
  return (
    <div className="w-full max-w-md rounded-xl border-0 shadow-lg overflow-hidden">
      {/* Image Placeholder */}
      <Skeleton className="h-64 w-full sm:h-80" />

      {/* Content Placeholder */}
      <div className="p-6 space-y-3">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/2" />

        {/* Buttons Placeholder */}
        <div className="mt-4 flex flex-col sm:flex-row sm:gap-3 gap-2">
          <Skeleton className="h-10 w-full sm:w-40 rounded-md" />
          <Skeleton className="h-10 w-full sm:w-40 rounded-md" />
        </div>
      </div>
    </div>
  );
};
export default SkeletonCard;
