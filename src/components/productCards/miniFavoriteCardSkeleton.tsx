import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function MiniFavoriteCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 bg-transparent">
      <CardContent className="flex items-center gap-2 p-2 h-[100px]">
        {/* Image Skeleton */}
        <Skeleton className="h-[80px] w-[60px] flex-shrink-0 rounded-md" />

        {/* Text & Button Skeleton */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-1 h-3 w-20" />
          </div>
          <Skeleton className="mt-1 h-7 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
