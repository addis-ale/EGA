import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TrendingCardSkeleton({ limit = 3 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
      {Array.from({ length: limit }).map((_, index) => (
        <Card
          key={index}
          className="w-full max-w-md overflow-hidden rounded-xl border-0 shadow-lg"
        >
          <div className="relative h-64 w-full sm:h-80">
            <Skeleton className="absolute inset-0 h-full w-full" />
          </div>

          <div className="p-6">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />

            <div className="flex flex-col sm:flex-row sm:gap-3 gap-2">
              <Skeleton className="h-10 w-full sm:w-auto rounded-md" />
              <Skeleton className="h-10 w-full sm:w-auto rounded-md" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
